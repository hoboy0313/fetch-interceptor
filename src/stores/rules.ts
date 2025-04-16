import {MatchType} from '@/lib/rule-matcher';
import {produce} from 'limu';
import {create} from 'zustand';
import {persist} from 'zustand/middleware';

import type {HttpMethod} from '@/constants/http-method';

export interface MockResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
}

export interface InterceptRule {
  id: string;
  enabled: boolean;
  description: string;
  methods: HttpMethod[];
  matchType: MatchType;
  response: MockResponse;
  createdAt: number;
  updatedAt: number;
}

interface RulesStore {
  rules: InterceptRule[];
  updateRule: (id: string, updates: Partial<InterceptRule>) => void;
  addRule: () => string;
  deleteRule: (id: string) => void;
  copyRule: (id: string) => string;
  getRuleById: (id: string) => InterceptRule | undefined;
}

const defaultResponse: MockResponse = {
  status: 200,
  statusText: 'OK',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({message: '这是一个模拟响应'}, null, 2),
};

function createNewRule(): InterceptRule {
  const now = Date.now();
  return {
    id: now.toString(),
    description: 'https://',
    enabled: true,
    methods: ['GET'],
    matchType: MatchType.CONTAINS,
    response: {...defaultResponse},
    createdAt: now,
    updatedAt: now,
  };
}

const initialRules = [
  {
    id: '1',
    enabled: true,
    description: 'https://example.com/api/users',
    methods: ['GET'],
    matchType: MatchType.CONTAINS,
    response: {
      ...defaultResponse,
      body: JSON.stringify([
        {id: 1, name: '张三', email: 'zhangsan@example.com'},
        {id: 2, name: '李四', email: 'lisi@example.com'},
      ], null, 2),
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '2',
    enabled: false,
    description: 'https://example.com/api/login',
    methods: ['POST'],
    matchType: MatchType.EXACT,
    response: {
      ...defaultResponse,
      body: JSON.stringify({success: true, token: 'mock-token-12345'}, null, 2),
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
] satisfies InterceptRule[];

const useRulesStore = create<RulesStore>()(
  persist(
    (set, get) => {
      return {
        rules: initialRules,
        updateRule(id, updates) {
          set(state => produce(state, draft => {
            const index = draft.rules.findIndex(r => r.id === id);
            if (index !== -1) {
              Object.assign(draft.rules[index], {...updates, updatedAt: Date.now()});
            }
          }));
        },
        addRule() {
          const newRule = createNewRule();
          set(state => ({
            rules: [newRule, ...state.rules],
          }));
          return newRule.id;
        },
        copyRule(id) {
          const newId = Date.now().toString();
          set(state => {
            const ruleToCopy = state.rules.find(rule => rule.id === id);
            if (!ruleToCopy)
              return state;

            const newRule = {
              ...ruleToCopy,
              id: newId,
              description: `${ruleToCopy.description} (副本)`,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            };

            return {
              rules: [newRule, ...state.rules],
            };
          });
          return newId;
        },
        deleteRule(id) {
          set(state => ({
            rules: state.rules.filter(r => r.id !== id),
          }));
        },
        getRuleById(id) {
          return get().rules.find(r => r.id === id);
        },
      };
    },
    {
      name: 'fetch-interceptor-rules',
    },
  ),
);

export {useRulesStore};
