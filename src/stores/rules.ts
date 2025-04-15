import {produce} from 'limu';
import {create} from 'zustand';

import type {HttpMethod} from '@/constants/http-method';

interface InterceptRule {
  id: string;
  enabled: boolean;
  description: string;
  methods: HttpMethod[];
}

interface RulesStore {
  rules: InterceptRule[];
  updateRule: (id: string, updates: Partial<InterceptRule>) => void;
  addRule: () => string;
  deleteRule: (id: string) => void;
  copyRule: (id: string) => string;
}

function createNewRule(): InterceptRule {
  return {
    id: Date.now().toString(),
    description: 'https://',
    enabled: true,
    methods: ['GET'],
  };
}

const initialRules = [
  {
    id: '1',
    enabled: true,
    description: 'https://www.baidu.com',
    methods: ['GET'],
  },
  {
    id: '2',
    enabled: false,
    description: 'https://www.baidu.com',
    methods: ['POST'],
  },
] satisfies InterceptRule[];

const useRulesStore = create<RulesStore>(set => {
  return {
    rules: initialRules,
    updateRule(id, updates) {
      set(state => produce(state, draft => {
        const index = draft.rules.findIndex(r => r.id === id);
        if (index !== -1) {
          Object.assign(draft.rules[index], updates);
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
  };
});

export {
  useRulesStore,
};

export type {
  InterceptRule,
};
