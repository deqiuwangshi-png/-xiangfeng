import { ChevronRight } from '@/components/icons';

const faqItems = [
  {
    id: 1,
    question: '反馈处理需要多久？',
  },
  {
    id: 2,
    question: '如何查看处理进度？',
  },
  {
    id: 3,
    question: '什么样的反馈容易被采纳？',
  },
];

/**
 * FAQ组件 - 服务端组件
 */
export default function FAQ() {
  return (
    <ul className="space-y-2 text-sm p-2">
      {faqItems.map((item) => (
        <li
          key={item.id}
          className="flex items-center justify-between p-2 hover:bg-xf-light rounded-lg cursor-pointer"
        >
          <span>{item.question}</span>
          <ChevronRight className="w-4 h-4 text-xf-primary" />
        </li>
      ))}
    </ul>
  );
}
