/**
 * 个人技能图谱组件
 * 显示用户的技能分布和熟练度
 */

import React from 'react';

interface SkillCategory {
  /** 类别ID */
  id: string;
  /** 类别名称 */
  name: string;
  /** 技能列表 */
  skills: SkillItem[];
}

interface SkillItem {
  /** 技能名称 */
  name: string;
  /** 技能熟练度（0-100） */
  proficiency: number;
}

interface ProfileSkillsProps {
  /** 技能分类列表 */
  categories: SkillCategory[];
}

const ProfileSkills: React.FC<ProfileSkillsProps> = ({ categories }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif text-[var(--color-xf-accent)] font-bold text-layer-1 mb-6">技能图谱</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="card-bg rounded-2xl p-6">
              <h3 className="text-lg font-serif text-[var(--color-xf-accent)] font-bold text-layer-1 mb-5">
                {category.name}
              </h3>
              <div className="space-y-4">
                {category.skills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm text-[var(--color-xf-dark)] mb-2">
                      <span className="font-medium">{skill.name}</span>
                      <span>{skill.proficiency}%</span>
                    </div>
                    <div className="skill-level">
                      <div 
                        className="skill-level-fill" 
                        style={{ width: `${skill.proficiency}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * 默认技能数据
 */
export const defaultSkillCategories: SkillCategory[] = [
  {
    id: '1',
    name: '认知领域',
    skills: [
      { name: '深度思考', proficiency: 92 },
      { name: '逻辑分析', proficiency: 85 },
      { name: '批判性思维', proficiency: 88 },
      { name: '概念抽象', proficiency: 76 }
    ]
  },
  {
    id: '2',
    name: '内容创作',
    skills: [
      { name: '深度写作', proficiency: 94 },
      { name: '内容策划', proficiency: 82 },
      { name: '创意表达', proficiency: 87 },
      { name: '编辑校对', proficiency: 80 }
    ]
  }
];

export default ProfileSkills;
