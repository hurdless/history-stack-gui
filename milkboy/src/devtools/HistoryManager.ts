// History 변경사항을 구독하는 콜백 함수 타입
type HistoryChangeCallback = () => void;

// History 스택의 각 항목을 나타내는 인터페이스
interface HistoryEntry {
  pathname: string;    // 현재 경로
  search: string;      // URL의 쿼리 파라미터
  hash: string;        // URL의 해시
  state: unknown;      // history.state에 저장된 상태
  timestamp: number;   // 항목이 생성된 시간
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
  }

  /**
   * popstate 이벤트 핸들러
   * 브라우저 네비게이션 시 히스토리 스택을 업데이트합니다.
   */
  private handlePopState = (event: PopStateEvent) => {
    const entry = this.createHistoryEntry(event.state);
    this.currentIndex = Math.max(0, this.currentIndex - 1);
    this.stack[this.currentIndex] = entry;
    this.notifyListeners();
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
      this.currentIndex++;
      // 현재 인덱스 이후의 항목들을 제거하고 새 항목 추가
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
    this.listeners.forEach(listener => listener());
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
    // TODO: History API 원래대로 복구하는 로직 추가 필요
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
export const historyManager = new HistoryManager();