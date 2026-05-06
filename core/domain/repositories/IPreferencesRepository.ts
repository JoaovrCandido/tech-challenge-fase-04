export interface UserPreferences {
  showPieChart: boolean;
  showBarChart: boolean;
  showSuggestions: boolean;
  savingsGoal: number;
  spendingAlert: number;
}

export interface IPreferencesRepository {
  getPreferences(userId: string): Promise<UserPreferences | null>;
  savePreferences(userId: string, preferences: UserPreferences): Promise<void>;
}