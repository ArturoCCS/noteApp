import { Timestamp } from "firebase-admin/firestore";
import { db } from "./admin";

export type WorkspaceDoc = {
  slug: string;
  ownerUid?: string;
  isPublic?: boolean;
  site?: any;
  navBar?: any;
  profile?: any;
  license?: any;
  expressiveCode?: any;
  pages?: { about?: { content?: string } };
  updatedAt?: any;
};

export async function getWorkspaceBySlug(slug: string) {
  const snap = await db.collection("workspaces").doc(slug).get();
  if (!snap.exists) return null;
  return snap.data() as WorkspaceDoc;
}

export async function upsertWorkspace(slug: string, data: Partial<WorkspaceDoc>) {
  await db.collection("workspaces").doc(slug).set(
    {
      ...data,
      slug,
      updatedAt: Timestamp.now(),
    },
    { merge: true },
  );
}