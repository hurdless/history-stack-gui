// History 변경사항을 구독하는 콜백 함수 타입
type HistoryChangeCallback = () => void;

// History 스택의 각 항목을 나타내는 인터페이스
interface HistoryEntry {
  pathname: string; // 현재 경로
  search: string; // URL의 쿼리 파라미터
  hash: string; // URL의 해시
  state: unknown; // history.state에 저장된 상태
  timestamp: number; // 항목이 생성된 시간
}

class HistoryManager {
  // 상태 변경을 감지하는 구독자들을 저장하는 Set
  private listeners: Set<HistoryChangeCallback> = new Set();
  // 전체 히스토리 스택을 저장하는 배열
  private stack: HistoryEntry[] = [];
  // 현재 활성화된 히스토리 항목의 인덱스
  private currentIndex: number = -1;

  constructor() {
    this.initializeStack();
    this.setupListeners();
    this.overrideHistoryMethods();
  }

  /**
   * 초기 히스토리 스택을 설정합니다.
   * 현재 페이지의 상태를 첫 번째 항목으로 추가합니다.
   */
  private initializeStack() {
    const currentEntry = this.createHistoryEntry(window.history.state);
    this.stack = [currentEntry];
    this.currentIndex = 0;
  }

  /**
   * 새로운 히스토리 항목을 생성합니다.
   * @param state - 저장할 상태 객체
   * @returns HistoryEntry 객체
   */
  private createHistoryEntry(state: unknown): HistoryEntry {
    return {
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      state,
      timestamp: Date.now(),
    };
  }

  /**
   * popstate 이벤트 리스너를 설정합니다.
   * 브라우저의 뒤로가기/앞으로가기 동작을 감지합니다.
   */
  private setupListeners() {
    window.addEventListener('popstate', this.handlePopState);
    window.addEventListener('click', this.handleAnchorClick);
  }

  /**
   * popstate 이벤트 핸들러
   * 브라우저 네비게이션 시 히스토리 스택을 업데이트합니다.
   */
  private handlePopState = (event: PopStateEvent) => {
    const entry = this.createHistoryEntry(event.state);

    console.log('event', event);
    console.log('this.stack', this.stack);
    console.log('entry', entry);
    // 현재 URL과 일치하는 스택의 인덱스 찾기
    const newIndex = this.stack.findIndex((item) => event.state.key === (item.state as { key: string }).key);

    console.log('newIndex', newIndex);

    if (newIndex !== -1) {
      this.currentIndex = newIndex;
    } else {
      // 스택에 없는 새로운 위치인 경우
      this.currentIndex++;
      this.stack.splice(this.currentIndex, this.stack.length - this.currentIndex, entry);
    }

    this.notifyListeners();
  };

  /**
   * 링크가 내부 링크인지 확인하는 헬퍼 함수
   */
  private isInternalLink(anchor: HTMLAnchorElement): boolean {
    // 다운로드 속성이 있는 경우
    if (anchor.hasAttribute('download')) return false;

    // target이 _blank인 경우
    if (anchor.target === '_blank') return false;

    const href = anchor.getAttribute('href');
    if (!href) return false;

    // 특수 링크 체크
    if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('sms:') || href.startsWith('#'))
      return false;

    try {
      // 현재 도메인과 다른 외부 링크 체크
      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return false;

      return true;
    } catch {
      // 상대 경로인 경우 내부 링크로 간주
      return true;
    }
  }

  /**
   * a 태그 클릭 이벤트를 가로채서 처리하는 핸들러
   */
  private handleAnchorClick = (event: MouseEvent) => {
    const anchor = (event.target as Element).closest('a');
    if (!anchor || !(anchor instanceof HTMLAnchorElement)) return;

    // 내부 링크가 아닌 경우 기본 동작 유지
    if (!this.isInternalLink(anchor)) return;

    // 메타키(cmd/ctrl)나 다른 수정자 키와 함께 클릭된 경우 기본 동작 유지
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const href = anchor.getAttribute('href');
    if (!href) return;

    event.preventDefault();

    window.history.pushState(null, '', href);
  };

  /**
   * 브라우저의 History API 메서드를 오버라이드합니다.
   * pushState와 replaceState 호출을 추적합니다.
   */
  private overrideHistoryMethods() {
    const originalPushState = window.history.pushState.bind(window.history);
    const originalReplaceState = window.history.replaceState.bind(window.history);

    // pushState 오버라이드: 새로운 히스토리 항목 추가
    window.history.pushState = (state: unknown, title: string, url?: string | null) => {
      originalPushState(state, title, url);

      const entry = this.createHistoryEntry(state);

      // 현재 인덱스 다음 위치에 새 항목 추가
      this.currentIndex++;
      this.stack.splice(this.currentIndex, this.stack.length - this.currentIndex, entry);

      this.notifyListeners();
    };

    // replaceState 오버라이드: 현재 히스토리 항목 교체
    window.history.replaceState = (state: unknown, title: string, url?: string | null) => {
      originalReplaceState(state, title, url);
      const entry = this.createHistoryEntry(state);
      this.stack[this.currentIndex] = entry;
      this.notifyListeners();
    };
  }

  /**
   * 모든 구독자에게 상태 변경을 알립니다.
   */
  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }

  // 공개 메서드들

  /**
   * 히스토리 변경사항을 구독합니다.
   * @param callback - 상태 변경 시 호출될 콜백 함수
   * @returns 구독 취소 함수
   */
  subscribe(callback: HistoryChangeCallback) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * 현재 히스토리 스택의 복사본을 반환합니다.
   */
  getCurrentStack(): HistoryEntry[] {
    return [...this.stack];
  }

  /**
   * 현재 활성화된 히스토리 항목의 인덱스를 반환합니다.
   */
  getCurrentIndex(): number {
    return this.currentIndex;
  }

  /**
   * 특정 인덱스의 히스토리 항목으로 이동합니다.
   * @param index - 이동할 히스토리 항목의 인덱스
   */
  navigate(index: number) {
    if (index >= 0 && index < this.stack.length) {
      const delta = index - this.currentIndex;
      window.history.go(delta);
    }
  }

  /**
   * 리소스 정리 및 이벤트 리스너 제거
   */
  cleanup() {
    window.removeEventListener('popstate', this.handlePopState);
    window.removeEventListener('click', this.handleAnchorClick);
    // TODO: History API 원래대로 복구하는 로직 추가 필요
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
export const historyManager = new HistoryManager();
