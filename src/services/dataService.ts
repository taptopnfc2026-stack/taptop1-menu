import {
  doc, setDoc, getDoc, deleteDoc, collection,
  query, where, getDocs, writeBatch,
} from 'firebase/firestore';
import { db, isConfigured } from '@/lib/firebase';
import type { Store, ReviewTemplate, User } from '@/types';

// ===== Type-safe serializers =====
function serialize(data: unknown): unknown {
  return JSON.parse(JSON.stringify(data, (_, v) => {
    if (v instanceof Date) return { __type: 'Date', value: v.toISOString() };
    return v;
  }));
}

function deserialize(data: unknown): unknown {
  return JSON.parse(JSON.stringify(data), (_, v) => {
    if (v && v.__type === 'Date') return new Date(v.value);
    return v;
  });
}

// ===== User Data =====
export async function saveUserData(userId: string, data: Partial<User>): Promise<void> {
  if (isConfigured) {
    await setDoc(doc(db, 'users', userId), serialize(data) as Record<string, unknown>, { merge: true });
  } else {
    localStorage.setItem('taptopmenu_user', JSON.stringify(data));
  }
}

export async function loadUserData(userId: string): Promise<User | null> {
  if (isConfigured) {
    const snap = await getDoc(doc(db, 'users', userId));
    return snap.exists() ? (deserialize(snap.data()) as User) : null;
  }
  const stored = localStorage.getItem('taptopmenu_user');
  return stored ? JSON.parse(stored) : null;
}

export async function deleteUserData(userId: string): Promise<void> {
  if (isConfigured) {
    await deleteDoc(doc(db, 'users', userId));
  }
  localStorage.removeItem('taptopmenu_user');
}

// ===== Store Data =====
export async function saveStores(userId: string, stores: Store[]): Promise<void> {
  if (isConfigured) {
    const batch = writeBatch(db);
    const colRef = collection(db, 'stores');
    // Save each store individually
    for (const store of stores) {
      batch.set(doc(colRef, store.id), serialize({ ...store, userId }) as Record<string, unknown>);
    }
    await batch.commit();
  } else {
    localStorage.setItem('taptopmenu_stores', JSON.stringify(stores));
  }
}

export async function loadStores(userId: string): Promise<Store[]> {
  if (isConfigured) {
    const colRef = collection(db, 'stores');
    const q = query(colRef, where('userId', '==', userId));
    const snap = await getDocs(q);
    return snap.docs.map(d => deserialize({ id: d.id, ...d.data() }) as Store);
  }
  const stored = localStorage.getItem('taptopmenu_stores');
  return stored ? JSON.parse(stored) : [];
}

export async function deleteStore(storeId: string): Promise<void> {
  if (isConfigured) {
    await deleteDoc(doc(db, 'stores', storeId));
  }
}

export async function deleteAllUserStores(userId: string): Promise<void> {
  if (isConfigured) {
    const colRef = collection(db, 'stores');
    const q = query(colRef, where('userId', '==', userId));
    const snap = await getDocs(q);
    const batch = writeBatch(db);
    snap.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
  }
  localStorage.removeItem('taptopmenu_stores');
}

// ===== Template Data =====
export async function saveTemplates(userId: string, templates: ReviewTemplate[]): Promise<void> {
  if (isConfigured) {
    const batch = writeBatch(db);
    const colRef = collection(db, 'templates');
    for (const template of templates) {
      batch.set(doc(colRef, template.id), serialize({ ...template, userId }) as Record<string, unknown>);
    }
    await batch.commit();
  } else {
    localStorage.setItem('taptopmenu_templates', JSON.stringify(templates));
  }
}

export async function loadTemplates(userId: string): Promise<ReviewTemplate[]> {
  if (isConfigured) {
    const colRef = collection(db, 'templates');
    const q = query(colRef, where('userId', '==', userId));
    const snap = await getDocs(q);
    return snap.docs.map(d => deserialize({ id: d.id, ...d.data() }) as ReviewTemplate);
  }
  const stored = localStorage.getItem('taptopmenu_templates');
  return stored ? JSON.parse(stored) : [];
}

export async function deleteAllUserTemplates(userId: string): Promise<void> {
  if (isConfigured) {
    const colRef = collection(db, 'templates');
    const q = query(colRef, where('userId', '==', userId));
    const snap = await getDocs(q);
    const batch = writeBatch(db);
    snap.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
  }
  localStorage.removeItem('taptopmenu_templates');
}

// ===== Analytics Data =====
export async function saveAnalytics(userId: string, data: unknown): Promise<void> {
  if (isConfigured) {
    await setDoc(doc(db, 'analytics', userId), serialize(data) as Record<string, unknown>, { merge: true });
  } else {
    localStorage.setItem('taptopmenu_analytics', JSON.stringify(data));
  }
}

export async function loadAnalytics(userId: string): Promise<unknown | null> {
  if (isConfigured) {
    const snap = await getDoc(doc(db, 'analytics', userId));
    return snap.exists() ? deserialize(snap.data()) : null;
  }
  const stored = localStorage.getItem('taptopmenu_analytics');
  return stored ? JSON.parse(stored) : null;
}

export async function deleteAnalytics(userId: string): Promise<void> {
  if (isConfigured) {
    await deleteDoc(doc(db, 'analytics', userId));
  }
  localStorage.removeItem('taptopmenu_analytics');
}

// ===== GDPR: Export all user data =====
export async function exportAllUserData(userId: string): Promise<Record<string, unknown>> {
  const user = await loadUserData(userId);
  const stores = await loadStores(userId);
  const templates = await loadTemplates(userId);
  const analytics = await loadAnalytics(userId);

  return {
    exportedAt: new Date().toISOString(),
    user,
    stores: stores || [],
    templates: templates || [],
    analytics: analytics || {},
  };
}

// ===== GDPR: Delete all user data =====
export async function deleteAllUserData(userId: string): Promise<void> {
  await deleteUserData(userId);
  await deleteAllUserStores(userId);
  await deleteAllUserTemplates(userId);
  await deleteAnalytics(userId);
  localStorage.clear();
}
