/**
 * title: 磁贴主页
 */
import React, { useEffect, useState } from 'react';
import TileGroup from '@/pages/hts/components/DDtile/tile_group';
import menuData from '../../../../config/routes';
import './style.less';

const Index: React.FC<unknown> = () => {

  const [menu, setMenu] = useState<any>([]);

  useEffect(() => {
    const groupMenu: any = [];
    menuData.forEach((item: any) => {
      const temp = { ...item };
      if (temp.type === 'title1') {
        // 将隐藏菜单排除
        const subMenu = temp.submenu || [];
        const content: any = [];
        subMenu.forEach((temp: any) => {
          // 将隐藏菜单、工作台不显示排除（隐藏菜单用于切换）
          if (!temp.hideInMenu && temp.workShowFlag != false) {
            content.push({ titel_main: temp.name, desc: temp.desc, icon: temp.icon, content: temp.content, route: temp.path });
          }
        });
        temp.content = temp.name;
        delete temp.submenu;
        groupMenu.push(temp);
        groupMenu.push({ type: 'tile', content: content });
      }
    });
    setMenu(groupMenu);
  }, [])

  return (
    <div className="hts_workspace_tile">
      <TileGroup data={menu} />
    </div>
  );
};
export default Index;