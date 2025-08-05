import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { FileSystemEntity } from "../types/index.js";

interface FileSystemStore {
  entities: Record<string, FileSystemEntity>;
  rootFolderId: string;

  createEntity: (
    entity: Omit<FileSystemEntity, "id" | "createdAt" | "updatedAt">
  ) => string;
  updateEntity: (id: string, updates: Partial<FileSystemEntity>) => void;
  deleteEntity: (id: string) => void;
  getEntity: (id: string) => FileSystemEntity | undefined;
  getChildren: (parentId: string) => FileSystemEntity[];
  moveEntity: (id: string, newParentId: string) => void;
  getEntityByPath: (path: string) => FileSystemEntity | undefined;
}

const createRootFolder = (): FileSystemEntity => ({
  id: "root",
  name: "miOS",
  type: "folder",
  children: ["apps"],
  path: "/",
  createdAt: new Date(),
  updatedAt: new Date(),
});

const createDefaultAppsFolder = (): FileSystemEntity => ({
  id: "apps",
  name: "Applications",
  type: "folder",
  parentId: "root",
  children: ["crypto-app"],
  path: "/Applications",
  createdAt: new Date(),
  updatedAt: new Date(),
});

const createCryptoApp = (): FileSystemEntity => ({
  id: "crypto-app",
  name: "Crypto",
  type: "file",
  parentId: "apps",
  path: "/Applications/Crypto",
  content: "",
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const useFileSystemStore = create<FileSystemStore>()(
  persist(
    (set, get) => ({
      entities: {
        root: createRootFolder(),
        apps: createDefaultAppsFolder(),
        "crypto-app": createCryptoApp(),
      },
      rootFolderId: "root",

      createEntity: (entityData) => {
        const id = `entity-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        const now = new Date();

        const entity: FileSystemEntity = {
          ...entityData,
          id,
          createdAt: now,
          updatedAt: now,
          children: entityData.type === "folder" ? [] : undefined,
        };

        set((state) => {
          const newEntities = { ...state.entities, [id]: entity };

          // Add to parent's children if it has a parent
          if (entity.parentId && newEntities[entity.parentId]) {
            const parent = newEntities[entity.parentId];
            if (parent.children) {
              newEntities[entity.parentId] = {
                ...parent,
                children: [...parent.children, id],
                updatedAt: now,
              };
            }
          }

          return { entities: newEntities };
        });

        return id;
      },

      updateEntity: (id, updates) => {
        set((state) => ({
          entities: {
            ...state.entities,
            [id]: state.entities[id]
              ? {
                  ...state.entities[id],
                  ...updates,
                  updatedAt: new Date(),
                }
              : state.entities[id],
          },
        }));
      },

      deleteEntity: (id) => {
        set((state) => {
          const entity = state.entities[id];
          if (!entity) return state;

          const newEntities = { ...state.entities };

          // Recursively delete children
          const deleteRecursive = (entityId: string) => {
            const ent = newEntities[entityId];
            if (ent?.children) {
              ent.children.forEach(deleteRecursive);
            }
            delete newEntities[entityId];
          };

          deleteRecursive(id);

          // Remove from parent's children
          if (entity.parentId && newEntities[entity.parentId]) {
            const parent = newEntities[entity.parentId];
            if (parent.children) {
              newEntities[entity.parentId] = {
                ...parent,
                children: parent.children.filter((childId) => childId !== id),
                updatedAt: new Date(),
              };
            }
          }

          return { entities: newEntities };
        });
      },

      getEntity: (id) => {
        return get().entities[id];
      },

      getChildren: (parentId) => {
        const parent = get().entities[parentId];
        if (!parent?.children) return [];

        return parent.children
          .map((id) => get().entities[id])
          .filter(Boolean) as FileSystemEntity[];
      },

      moveEntity: (id, newParentId) => {
        set((state) => {
          const entity = state.entities[id];
          const newParent = state.entities[newParentId];

          if (!entity || !newParent || newParent.type !== "folder") {
            return state;
          }

          const newEntities = { ...state.entities };
          const now = new Date();

          // Remove from old parent
          if (entity.parentId && newEntities[entity.parentId]) {
            const oldParent = newEntities[entity.parentId];
            if (oldParent.children) {
              newEntities[entity.parentId] = {
                ...oldParent,
                children: oldParent.children.filter(
                  (childId) => childId !== id
                ),
                updatedAt: now,
              };
            }
          }

          // Add to new parent
          newEntities[newParentId] = {
            ...newParent,
            children: [...(newParent.children || []), id],
            updatedAt: now,
          };

          // Update entity's parent and path
          const newPath =
            newParent.path === "/"
              ? `/${entity.name}`
              : `${newParent.path}/${entity.name}`;
          newEntities[id] = {
            ...entity,
            parentId: newParentId,
            path: newPath,
            updatedAt: now,
          };

          return { entities: newEntities };
        });
      },

      getEntityByPath: (path) => {
        const entities = get().entities;
        return Object.values(entities).find((entity) => entity.path === path);
      },
    }),
    {
      name: "mios-filesystem",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
