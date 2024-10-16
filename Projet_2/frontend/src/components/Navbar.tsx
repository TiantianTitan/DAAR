// components/Navbar.tsx
import { Link } from 'react-router-dom'
import styles from './Navbar.module.css'

export const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/shop">商城</Link>
        </li>
        <li>
          <Link to="/backpack">背包</Link>
        </li>
        <li>
          <Link to="/mint">铸造</Link>
        </li>
        <li>
          <Link to="/trade">交易</Link>
        </li>
      </ul>
    </nav>
  )
}
