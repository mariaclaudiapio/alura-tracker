import { createStore, Store, useStore as vuexUseStore } from "vuex"
import { InjectionKey } from "@vue/runtime-core"

import { ADICIONA_TAREFAS, ALTERA_TAREFAS, DEFINIR_TAREFAS, NOTIFICAR } from "./tipo_mutacoes"
import { INotificacao } from './../interfaces/INotificacao'
import { OBTER_TAREFAS, CADASTRAR_TAREFAS, ALTERAR_TAREFAS } from './tipo_acoes'
import http from "@/http"
import ITarefa from "@/interfaces/ITarefa"
import { EstadoProjeto, projeto } from "./modulos/projeto"

export interface Estado {
    tarefas: ITarefa[],
    notificacoes: INotificacao[],
    projeto: EstadoProjeto
}

export const key: InjectionKey<Store<Estado>> = Symbol()

export const store = createStore<Estado>({
    state: {
        tarefas: [],
        notificacoes: [],
        projeto: {
            projetos: []
        }
    },
    mutations: {
        [DEFINIR_TAREFAS] (state, tarefas: ITarefa[]) {
            state.tarefas = tarefas
        },
        [ADICIONA_TAREFAS] (state, tarefa: ITarefa) {
            state.tarefas.push(tarefa)
        },
        [ALTERA_TAREFAS] (state, tarefa: ITarefa) {
            const index = state.tarefas.findIndex(t => t.id == tarefa.id)
            state.tarefas[index] = tarefa
        },
        [NOTIFICAR] (state, novaNotificacao: INotificacao) {
            novaNotificacao.id = new Date().getTime()
            state.notificacoes.push(novaNotificacao)
            
            setTimeout(() => {
                state.notificacoes = state.notificacoes.filter(notificacao => notificacao.id != novaNotificacao.id)
            }, 3000)
        },
        
    },
    actions: {
        [OBTER_TAREFAS] ({ commit }) {
            http.get('tarefas')
            .then(response => commit(DEFINIR_TAREFAS, response.data))
        },
        [CADASTRAR_TAREFAS] ({ commit }, tarefa: ITarefa) {
            return http.post('/tarefas', tarefa)
            .then(resposta => commit(ADICIONA_TAREFAS, resposta.data))
        },
        [ALTERAR_TAREFAS] ({ commit }, tarefa: ITarefa) {
            return http.put(`/tarefas/${tarefa.id}`, tarefa)
                .then(() => commit(ALTERA_TAREFAS, tarefa))
        },
    },
    modules: {
        projeto
    }
})

export function useStore(): Store<Estado> {
    return vuexUseStore(key)
}