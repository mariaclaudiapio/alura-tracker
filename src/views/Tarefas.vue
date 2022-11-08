<template>
  <Formulario @aoSalvarTarefa="salvarTarefa" />
  <div class="lista">
    <Box v-if="listaEstaVazia"> Você não está muito produtivo hoje! 😥 </Box>
    <Tarefa v-for="(tarefa, index) in tarefas" :key="index" 
      :tarefa="tarefa" @aoTarefaClicada="selecionarTarefa" />
    <Modal :mostrar="tarefaSelecionada != null">
      <template v-slot:cabecalho>
        <p class="modal-card-title">Editando uma tarefa</p>
        <button @click="fecharModal" class="delete" aria-label="close"></button>
      </template>
      <template v-slot:corpo>
        <div class="field">
        <label for="descricaoDaTarefa" class="label"> Descrição </label>
        <input
          type="text"
          class="input"
          v-model="tarefaSelecionada.descricao"
          id="descricaoDaTarefa"
        />
      </div>
      </template>
      <template v-slot:rodape>
        <button @click="alterarTarefa" class="button is-success">Savar alterações</button>
        <button @click="fecharModal" class="button">Cancelar</button>
      </template>
    </Modal>
  </div>  
</template>
  
<script lang="ts">
import { computed, defineComponent } from "vue";

import Formulario from "../components/Formulario.vue";
import Tarefa from "../components/Tarefa.vue";
import Box from "../components/Box.vue";
import Modal from "../components/Modal.vue";
import { ALTERAR_TAREFAS, CADASTRAR_TAREFAS, OBTER_PROJETOS, OBTER_TAREFAS } from "@/store/tipo_acoes";
import { useStore } from "@/store";
import ITarefa from "@/interfaces/ITarefa";

export default defineComponent({
  name: "App",
  components: {
    Formulario,
    Tarefa,
    Box,
    Modal
  },
  data () {
    return {
      tarefaSelecionada: null as ITarefa | null
    }
  },
  computed: {
    listaEstaVazia(): boolean {
      return this.tarefas.length === 0;
    },
  },
  setup () {
    const store = useStore()
    store.dispatch(OBTER_TAREFAS)
    store.dispatch(OBTER_PROJETOS)
      return {
        tarefas: computed(() => store.state.tarefas),
        store
      }
  },
  methods: {
    salvarTarefa (tarefa: ITarefa) : void {
      this.store.dispatch(CADASTRAR_TAREFAS, tarefa)
    },
    selecionarTarefa (tarefa: ITarefa) {
      this.tarefaSelecionada = tarefa
    },
    fecharModal () {
      this.tarefaSelecionada = null
    },
    alterarTarefa () {
      this.store.dispatch(ALTERAR_TAREFAS, this.tarefaSelecionada)
        .then(() => this.fecharModal())
    } 
  },
});
</script>
  
  