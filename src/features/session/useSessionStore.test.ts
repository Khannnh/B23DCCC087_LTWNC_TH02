import { beforeEach, describe, expect, it } from 'vitest';
import { useSessionStore } from './useSessionStore';
import type { Exercise } from '../../types';

const exerciseOne: Exercise = {
  id: 'e1',
  name: 'Đẩy tạ đơn 1',
  trainer: 'Minh Khang',
  group: 'Ngực',
  duration: 30,
};

const exerciseTwo: Exercise = {
  id: 'e2',
  name: 'Kéo tạ đơn 1',
  trainer: 'Thu Trang',
  group: 'Lưng',
  duration: 67,
};

beforeEach(() => {
  useSessionStore.setState({
    queue: [],
    currentIndex: -1,
    isRunning: false,
    elapsed: 0,
  });
});

describe('useSessionStore', () => {
  it('bắt đầu buổi tập ở đúng bài và đặt lại thời gian', () => {
    useSessionStore.getState().startSession([exerciseOne, exerciseTwo], 1);

    expect(useSessionStore.getState()).toMatchObject({
      queue: [exerciseOne, exerciseTwo],
      currentIndex: 1,
      isRunning: true,
      elapsed: 0,
    });
  });

  it('tự chuyển sang bài sau khi hết thời lượng bài hiện tại', () => {
    useSessionStore.getState().startSession([exerciseOne, exerciseTwo], 0);
    useSessionStore.setState({ elapsed: exerciseOne.duration - 1 });

    useSessionStore.getState().tick();

    expect(useSessionStore.getState()).toMatchObject({
      currentIndex: 1,
      isRunning: true,
      elapsed: 0,
    });
  });

  it('dừng chạy khi chuyển tiếp ở bài cuối', () => {
    useSessionStore.getState().startSession([exerciseOne], 0);

    useSessionStore.getState().next();

    expect(useSessionStore.getState()).toMatchObject({
      currentIndex: 0,
      isRunning: false,
    });
  });

  it('chỉ đặt lại elapsed khi lùi sau hơn ba giây', () => {
    useSessionStore.getState().startSession([exerciseOne, exerciseTwo], 1);
    useSessionStore.setState({ elapsed: 4 });

    useSessionStore.getState().prev();

    expect(useSessionStore.getState()).toMatchObject({
      currentIndex: 1,
      elapsed: 0,
    });
  });

  it('bỏ qua bài tập đã có trong queue', () => {
    useSessionStore.getState().startSession([exerciseOne], 0);

    useSessionStore.getState().addToSession(exerciseOne);

    expect(useSessionStore.getState().queue).toEqual([exerciseOne]);
  });

  it('giữ nguyên state khi bắt đầu với danh sách rỗng', () => {
    useSessionStore.getState().startSession([exerciseOne], 0);
    const previousState = useSessionStore.getState();

    useSessionStore.getState().startSession([], 0);

    expect(useSessionStore.getState()).toBe(previousState);
  });

  it('chuyển trạng thái chạy khi buổi tập đã bắt đầu', () => {
    useSessionStore.getState().startSession([exerciseOne], 0);

    useSessionStore.getState().toggleRun();
    expect(useSessionStore.getState().isRunning).toBe(false);

    useSessionStore.getState().toggleRun();
    expect(useSessionStore.getState().isRunning).toBe(true);
  });

  it('tăng elapsed khi bài chưa hết thời lượng', () => {
    useSessionStore.getState().startSession([exerciseOne], 0);
    useSessionStore.setState({ elapsed: 10 });

    useSessionStore.getState().tick();

    expect(useSessionStore.getState().elapsed).toBe(11);
  });

  it('chuyển sang bài sau khi bấm next trước bài cuối', () => {
    useSessionStore.getState().startSession([exerciseOne, exerciseTwo], 0);
    useSessionStore.setState({ elapsed: 5 });

    useSessionStore.getState().next();

    expect(useSessionStore.getState()).toMatchObject({
      currentIndex: 1,
      elapsed: 0,
      isRunning: true,
    });
  });

  it('lùi về bài trước nếu elapsed không quá ba giây', () => {
    useSessionStore.getState().startSession([exerciseOne, exerciseTwo], 1);
    useSessionStore.setState({ elapsed: 3 });

    useSessionStore.getState().prev();

    expect(useSessionStore.getState()).toMatchObject({ currentIndex: 0, elapsed: 0 });
  });

  it('giữ nguyên bài đầu tiên khi lùi nhưng vẫn reset elapsed', () => {
    useSessionStore.getState().startSession([exerciseOne, exerciseTwo], 0);
    useSessionStore.setState({ elapsed: 2 });

    useSessionStore.getState().prev();

    expect(useSessionStore.getState()).toMatchObject({ currentIndex: 0, elapsed: 0 });
  });

  it('thêm bài mới vào cuối queue', () => {
    useSessionStore.getState().addToSession(exerciseOne);

    expect(useSessionStore.getState().queue).toEqual([exerciseOne]);
  });

  it('không tick khi chưa có bài hiện tại', () => {
    useSessionStore.getState().tick();

    expect(useSessionStore.getState()).toMatchObject({
      queue: [],
      currentIndex: -1,
      elapsed: 0,
    });
  });
});
