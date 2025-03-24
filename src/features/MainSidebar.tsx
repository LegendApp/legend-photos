import { Sidebar } from '@/components/Sidebar';
import {
  type SidebarItemWithSource,
  allSidebarGroups$,
  folderInfoToId,
  getOpenFolder,
  setOpenFolder,
} from '@/plugin-system/FileSources';
import type { SidebarItem } from '@/plugin-system/PluginTypes';
import { settings$ } from '@/settings/SettingsFile';
import { useObserveEffect, useSelector } from '@legendapp/state/react';
import React from 'react';

export function MainSidebar() {
  const selectedFolderId = useSelector(settings$.state.openFolder);
  const sidebarGroups = useSelector(allSidebarGroups$) || [];
  const sidebarWidth = useSelector(settings$.state.sidebarWidth);

  const isItemSelected = (item: SidebarItem) => {
    console.log(selectedFolderId, folderInfoToId(item as SidebarItemWithSource));
    return selectedFolderId === folderInfoToId(item as SidebarItemWithSource);
  };

  const onSelectFolder = (item: SidebarItem) => {
    const itemWithSource = item as SidebarItemWithSource;
    setOpenFolder({
      path: itemWithSource.path,
      source: itemWithSource.source,
    });
  };

  useObserveEffect((e) => {
    if (!selectedFolderId) {
      const openFolder = getOpenFolder();
      if (openFolder) {
        e.cancel = true;
      } else {
        const allSidebarGroups = allSidebarGroups$.get();
        if (allSidebarGroups?.length) {
          console.log('selecting first folder');
          for (const group of allSidebarGroups) {
            for (const item of group.items) {
              if (item.source === 'plugin-local-files') {
                onSelectFolder(item);
                e.cancel = true;
                return;
              }
            }
          }
        }
      }
    }
  });

  return (
    <Sidebar
      items={sidebarGroups}
      isItemSelected={isItemSelected}
      onSelectItem={onSelectFolder}
      width={sidebarWidth}
      showGroups={true}
      className="pt-10"
    />
  );
}
