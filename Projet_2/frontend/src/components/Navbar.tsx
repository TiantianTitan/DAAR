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
          <Link to="/shop">Shop</Link>
        </li>
        <li>
          <Link to="/backpack">BackPack</Link>
        </li>
        <li>
          <Link to="/mint">Mint</Link>
        </li>
        <li>
          <Link to="/trade">Trade</Link>
        </li>
      </ul>
    </nav>
  )
}
