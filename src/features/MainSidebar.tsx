import { Sidebar } from '@/components/Sidebar';
import {
  type SidebarItemWithSource,
  allSidebarGroups$,
  getOpenFolder,
  setOpenFolder,
} from '@/plugin-system/FileSources';
import { settings$ } from '@/settings/SettingsFile';
import { useObserveEffect, useSelector } from '@legendapp/state/react';
import React from 'react';

export function MainSidebar() {
  const selectedFolderId = useSelector(settings$.state.openFolder);
  const sidebarGroups = useSelector(allSidebarGroups$) || [];
  const sidebarWidth = useSelector(settings$.state.sidebarWidth);

  const onSelectFolder = (item: SidebarItemWithSource) => {
    setOpenFolder({
      path: item.path,
      source: item.source,
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
      selectedItemId={selectedFolderId || ''}
      onSelectItem={onSelectFolder}
      width={sidebarWidth}
      showGroups={true}
      className="pt-10"
    />
  );
}
