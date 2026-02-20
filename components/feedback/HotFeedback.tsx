export default function HotFeedback() {
  const hotFeedbacks = [
    {
      title: '深色模式支持',
      votes: 32,
    },
    {
      title: '编辑器卡顿问题反馈',
      votes: 18,
    },
  ];

  return (
    <div className="space-y-4">
      {hotFeedbacks.map((item, index) => (
        <div
          key={index}
          className="p-4 bg-xf-light/50 rounded-xl"
        >
          <span className="text-sm">
            🔥 热门：{item.title} ({item.votes}人点赞)
          </span>
        </div>
      ))}
    </div>
  );
}
