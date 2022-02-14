import React, { useState } from 'react'
import { Menu } from 'semantic-ui-react'

function NavBar() {
    const [activeItem, setActiveItem] = useState('');

  const handleItemClick = (e, { name }) =>  setActiveItem(name);

    return (
      <Menu tabular>
        <Menu.Item
          name='home'
          active={activeItem === 'home'}
          onClick={handleItemClick}
        />
        <Menu position='right'>
        <Menu.Item
          name='login'
          active={activeItem === 'login'}
          onClick={handleItemClick}
        />
        <Menu.Item
          name='register'
          active={activeItem === 'register'}
          onClick={handleItemClick}
        />
        </Menu>
      </Menu>
    )
}

export default NavBar;