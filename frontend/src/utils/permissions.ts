// 画面別権限設定（モック用）
export interface ScreenPermissions {
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
  canView: boolean
  specialPermissions?: Record<string, boolean>
}

export interface UserRole {
  id: string
  name: string
  level: number
  permissions: Record<string, ScreenPermissions>
}

// ユーザーロール定義
export const USER_ROLES: Record<string, UserRole> = {
  admin: {
    id: 'admin',
    name: '管理者',
    level: 10,
    permissions: {
      dashboard: {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canView: true
      },
      customers: {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canView: true
      },
      products: {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canView: true
      },
      orders: {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canView: true
      },
      partners: {
        canCreate: true,
        canEdit: true,
        canDelete: false, // 削除権限なし（デモ用）
        canView: true,
        specialPermissions: {
          canSuspend: false // 停止権限なし（デモ用）
        }
      },
      suppliers: {
        canCreate: false, // 作成権限なし（デモ用）
        canEdit: true,
        canDelete: false,
        canView: true,
        specialPermissions: {
          canBlacklist: true
        }
      },
      invoices: {
        canCreate: true,
        canEdit: true,
        canDelete: false, // 削除権限なし（デモ用）
        canView: true,
        specialPermissions: {
          canSend: true,
          canMarkPaid: false, // 支払い確認権限なし（デモ用）
          canCancel: true
        }
      },
      inventory: {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canView: true,
        specialPermissions: {
          canAdjustStock: true,
          canReorder: false, // 発注権限なし（デモ用）
          canTransfer: true,
          canSetLevels: false, // 在庫レベル設定権限なし（デモ用）
          canViewCosts: true
        }
      }
    }
  },
  manager: {
    id: 'manager',
    name: 'マネージャー',
    level: 7,
    permissions: {
      dashboard: {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canView: true
      },
      customers: {
        canCreate: true,
        canEdit: true,
        canDelete: false,
        canView: true
      },
      products: {
        canCreate: true,
        canEdit: true,
        canDelete: false,
        canView: true
      },
      orders: {
        canCreate: true,
        canEdit: true,
        canDelete: false,
        canView: true
      },
      partners: {
        canCreate: false,
        canEdit: true,
        canDelete: false,
        canView: true,
        specialPermissions: {
          canSuspend: false
        }
      },
      suppliers: {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canView: true,
        specialPermissions: {
          canBlacklist: false
        }
      },
      invoices: {
        canCreate: true,
        canEdit: true,
        canDelete: false,
        canView: true,
        specialPermissions: {
          canSend: true,
          canMarkPaid: true,
          canCancel: false
        }
      },
      inventory: {
        canCreate: false,
        canEdit: true,
        canDelete: false,
        canView: true,
        specialPermissions: {
          canAdjustStock: true,
          canReorder: true,
          canTransfer: true,
          canSetLevels: false,
          canViewCosts: true
        }
      }
    }
  },
  staff: {
    id: 'staff',
    name: 'スタッフ',
    level: 5,
    permissions: {
      dashboard: {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canView: true
      },
      customers: {
        canCreate: true,
        canEdit: false,
        canDelete: false,
        canView: true
      },
      products: {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canView: true
      },
      orders: {
        canCreate: true,
        canEdit: false,
        canDelete: false,
        canView: true
      },
      partners: {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canView: true,
        specialPermissions: {
          canSuspend: false
        }
      },
      suppliers: {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canView: true,
        specialPermissions: {
          canBlacklist: false
        }
      },
      invoices: {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canView: true,
        specialPermissions: {
          canSend: false,
          canMarkPaid: false,
          canCancel: false
        }
      },
      inventory: {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canView: true,
        specialPermissions: {
          canAdjustStock: false,
          canReorder: false,
          canTransfer: false,
          canSetLevels: false,
          canViewCosts: false
        }
      }
    }
  }
}

// 現在のユーザー（モック）
export const CURRENT_USER_ROLE = 'admin' // デモ用に管理者権限

// 権限チェック関数
export const hasPermission = (
  screen: string, 
  action: keyof ScreenPermissions | string,
  userRole: string = CURRENT_USER_ROLE
): boolean => {
  const role = USER_ROLES[userRole]
  if (!role) return false
  
  const screenPermissions = role.permissions[screen]
  if (!screenPermissions) return false
  
  // 標準権限のチェック
  if (action in screenPermissions) {
    return screenPermissions[action as keyof ScreenPermissions] as boolean
  }
  
  // 特別権限のチェック
  if (screenPermissions.specialPermissions && action in screenPermissions.specialPermissions) {
    return screenPermissions.specialPermissions[action]
  }
  
  return false
}

// 権限レベルチェック関数
export const hasMinimumLevel = (
  requiredLevel: number,
  userRole: string = CURRENT_USER_ROLE
): boolean => {
  const role = USER_ROLES[userRole]
  return role ? role.level >= requiredLevel : false
}

// 権限が制限されている理由を取得
export const getPermissionDeniedReason = (
  screen: string,
  action: string,
  userRole: string = CURRENT_USER_ROLE
): string => {
  const role = USER_ROLES[userRole]
  if (!role) return '無効なユーザーロールです'
  
  const actionLabels: Record<string, string> = {
    canCreate: '作成',
    canEdit: '編集',
    canDelete: '削除',
    canView: '閲覧',
    canSuspend: '停止',
    canBlacklist: 'ブラックリスト登録',
    canSend: '送信',
    canMarkPaid: '支払い確認',
    canCancel: 'キャンセル',
    canAdjustStock: '在庫調整',
    canReorder: '発注',
    canTransfer: '移動',
    canSetLevels: '在庫レベル設定',
    canViewCosts: '原価閲覧'
  }
  
  const actionLabel = actionLabels[action] || action
  return `${actionLabel}権限がありません`
}

// デモ用の権限制限パターン
export const DEMO_RESTRICTIONS = {
  partners: {
    canDelete: 'デモ版では削除機能は制限されています',
    canSuspend: '停止権限は上級管理者のみ利用可能です'
  },
  suppliers: {
    canCreate: '新規仕入先登録は承認プロセスが必要です'
  },
  invoices: {
    canMarkPaid: '支払い確認は経理部門の権限が必要です'
  },
  inventory: {
    canReorder: '発注権限は購買部門の承認が必要です',
    canSetLevels: '在庫レベル設定は倉庫管理者権限が必要です'
  }
}
