import { skillGroups } from '../data/profile.js';
import { SectionHead } from './SectionHead.jsx';
import { Icon } from './Icon.jsx';
import { Tag } from './Tag.jsx';

export function Skills() {
  return (
    <section className="section" id="skills" aria-labelledby="skills-title">
      <div className="container">
        <SectionHead
          index="05"
          eyebrow="Technical skills"
          title="The toolkit, grouped the way I use it."
          titleId="skills-title"
          lede="Eight areas rather than one long list. The first two are open — expand any group to see the rest."
        />

        <div className="skill-groups">
          {skillGroups.map((group) => (
            <details className="skill-group js-reveal" key={group.name} open={group.open}>
              <summary>
                <span className="skill-group__icon" aria-hidden="true"><Icon name={group.icon} /></span>
                <span className="skill-group__name">{group.name}</span>
                <span className="skill-group__count">{String(group.items.length).padStart(2, '0')}</span>
              </summary>
              <div className="skill-group__list">
                {group.items.map((item) => <Tag key={item}>{item}</Tag>)}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
