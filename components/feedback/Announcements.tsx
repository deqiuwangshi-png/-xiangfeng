export default function Announcements() {
  const announcements = [
    {
      title: '新版本计划：2025 Q1 路线图',
      icon: '📢',
    },
    {
      title: '感恩回馈：反馈有礼活动',
      icon: '📢',
    },
  ];

  return (
    <div className="space-y-4">
      {announcements.map((item, index) => (
        <div
          key={index}
          className="p-4 bg-xf-light/50 rounded-xl"
        >
          <span className="text-sm">
            {item.icon} {item.title}
          </span>
        </div>
      ))}
    </div>
  );
}
