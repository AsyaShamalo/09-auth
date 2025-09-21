import css from './SidebarNotes.module.css'
import Link from 'next/link';

const tags:string[] = ['Todo', "Work", "Personal", "Meeting", "Shopping"]

export default function SideBarNotes() {
    return (<ul className={css.menuList}>
      <li className={css.menuItem} key={"All"}>
        <Link href={"/notes/filter/All"} className={css.menuLink}>
          All notes
        </Link>
      </li>
      {tags.map(tag => (<li className={css.menuItem} key={typeof tag === 'string' ? tag : tag}>
        <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
          {typeof tag === 'string' ? tag : tag}
        </Link>
      </li>))}
    </ul>
    )
}