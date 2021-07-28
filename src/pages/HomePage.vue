<template>
  <v-form v-model="valid">
    <v-container>
      <v-row cols="12">
        <v-col md="3">
          <v-text-field v-model="empresa" label="Empresa"></v-text-field>
        </v-col>

        <v-col md="3">
          <v-text-field
            v-model="codigoFilial"
            label="Código Filial"
          ></v-text-field>
        </v-col>

        <v-col md="3">
          <v-text-field v-model="nomeFilial" label="Filial"></v-text-field>
        </v-col>
        <v-col md="3">
          <v-menu
            v-model="dtLancamentoInicial"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                label="Lançamento Inicial"
                readonly
                :value="dtLancamentoInicialFormat"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              locale="en-in"
              v-model="dtInicial"
              no-title
              @input="dtLancamentoInicial = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-row cols="12">
        <v-col md="3">
          <v-menu
            v-model="dtLancamentoFinal"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                label="Lançamento Final"
                readonly
                :value="dtLancamentoFinalFormat"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              locale="en-in"
              v-model="dtFinal"
              no-title
              @input="dtLancamentoFinal = false"
            ></v-date-picker>
          </v-menu>
        </v-col>

        <v-col md="3">
          <v-text-field
            v-model="codigoCliente"
            label="Código Cliente"
          ></v-text-field>
        </v-col>

        <v-col md="3">
          <v-text-field v-model="nomeCliente" label="Cliente"></v-text-field>
        </v-col>
        <v-col md="3">
          <v-text-field v-model="cnpj" label="Cnpj"></v-text-field>
        </v-col>
      </v-row>
      <v-row cols="12">
        <v-col md="3">
          <v-text-field v-model="lancamento" label="Lançamento"></v-text-field>
        </v-col>

        <v-col md="3">
          <v-combobox
            v-model="formaPagamento"
            :items="formaPagamentoList"
            label="Forma Pagamento"
          ></v-combobox>
        </v-col>

        <v-col md="3">
          <v-text-field v-model="nsu" label="NSU"></v-text-field>
        </v-col>
        <v-col md="3">
          <v-text-field
            v-model="numeroAutorizacao"
            label="Nº Autorização"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-btn class="mx-2" fab dark small color="primary">
          <v-icon dark>
            mdi-magnify
          </v-icon>
        </v-btn>
        <v-btn class="mx-2" fab dark small color="primary">
          <download-excel
            class="btn btn-default"
            :data="clientList"
            worksheet="My Worksheet"
            name="filename.xls"
          >
            <v-icon dark>
              mdi-microsoft-excel
            </v-icon>
          </download-excel>
        </v-btn>
        <v-btn
          class="mx-2"
          fab
          dark
          small
          color="primary"
          @click="createPDFList()"
        >
          <v-icon dark>
            mdi-pdf-box
          </v-icon>
        </v-btn>
      </v-row>
      <v-row cols="12">
        <v-col md="12">
          <v-data-table
            dense
            id="tablePrincipal"
            :headers="headers"
            :items="clientList"
            item-key="id"
            class="elevation-1"
          >
            <template v-slot:item.actions="{ item }">
              <v-icon
                small
                class="mr-2"
                @click="openDialogDetailClientReport(item)"
              >
                mdi-magnify
              </v-icon>
              <v-icon small class="mr-2" @click="createPDFDetail(item)">
                mdi-pdf-box
              </v-icon>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <v-dialog
        ref="myTable"
        v-model="dialog"
        max-width="1300px"
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-row cols="12" align="center" justify="center">
            <v-col md="9">
              <!-- Cliente -->
              <v-data-table
                id="tableClientInternal"
                dense
                :headers="headersClientDetail"
                :items="detailClient"
                item-key="codigoCliente"
                class="elevation-1"
                hide-default-footer
              ></v-data-table>
            </v-col>
          </v-row>

          <v-row align="center" justify="center">
            <v-col md="9">
              <!-- Titulos -->
              <v-data-table
                id="tableTitles"
                dense
                :headers="headerTitles"
                :items="detailTitleList"
                item-key="id"
                class="elevation-1"
                hide-default-footer
              ></v-data-table>
            </v-col>
          </v-row>

          <v-row align="center" justify="center">
            <v-col md="10">
              <!-- Pagamentos -->
              <v-data-table
                id="tablePayments"
                dense
                :headers="headerPayments"
                :items="detailPaymentList"
                item-key="id"
                class="elevation-1"
                hide-default-footer
              ></v-data-table>
            </v-col>
          </v-row>

          <v-row align="center">
            <v-card-actions>
              <v-col md="12" id="btnActions">
                <v-btn
                  class="mx-2"
                  fab
                  dark
                  small
                  color="primary"
                  @click="openDialogPDF()"
                >
                  <v-icon dark>
                    mdi-pdf-box
                  </v-icon>
                </v-btn>
                <v-btn class="mx-2" fab dark small color="primary">
                  <download-excel
                    class="btn btn-default"
                    :data="detailClient"
                    worksheet="My Worksheet"
                    name="filename.xls"
                  >
                    <v-icon dark>
                      mdi-microsoft-excel
                    </v-icon>
                  </download-excel>
                </v-btn>
              </v-col>
              <v-col id="btnCancel">
                <v-btn class="mx-2" color="primary" text @click="close">
                  Sair
                </v-btn>
              </v-col>
            </v-card-actions>
          </v-row>
        </v-card>
      </v-dialog>
    </v-container>
  </v-form>
</template>

<script>
import axios from "axios";
import Vue from "vue";
import JsonExcel from "vue-json-excel";
import jsPDF from "jspdf";
import "jspdf-autotable";

Vue.component("downloadExcel", JsonExcel);

export default {
  components: {},
  data: () => ({
    valid: false,
    empresa: "",
    codigoFilial: "",
    nomeFilial: "",
    codigoCliente: "",
    nomeCliente: "",
    cnpj: "",
    lancamento: "",
    formaPagamento: "",
    nsu: "",
    numeroAutorizacao: "",
    formaPagamentoList: [
      "Cartão de Crédito",
      "Cartão de Débito",
      "Boleto",
      "Á vista",
    ],
    email: "",
    titleExcelDetail: "",
    dtLancamentoInicial: false,
    dtLancamentoFinal: false,
    dtInicial: null,
    dtFinal: null,
    dialog: false,
    dialogPdf: false,
    sumTitles: 12,
    sumTitlesValues: 10000.0,
    clientList: [],
    detailClient: [],
    detailTitleList: [],
    detailPaymentList: [],
    detailClientExcel: null,
    hasAlreadyParsed: false,
    progress: 0,
    pdfWindow: null,
    pdfFile: null,
    clientDetail: [],
    titlesDetail: [],
    paymentDetail: [],
    headers: [
      { text: "Código do Cliente", value: "codigoCliente", sortable: true },
      { text: "Cliente", value: "nome", sortable: true },
      { text: "CNPJ", value: "cnpj", sortable: true },
      {
        text: "Qtde de Títulos Renegociados",
        value: "quantidadeTitulos",
        sortable: true,
      },
      {
        text: "Total Pago na Renegociação",
        value: "totalPago",
        sortable: true,
      },
      { text: "Ações", value: "actions", sortable: false },
    ],
    headersClientDetail: [
      { text: "Código do Cliente", value: "codigoCliente", sortable: false },
      { text: "Cliente", value: "nome", sortable: false },
      { text: "CNPJ", value: "cnpj", sortable: false },
      {
        text: "Qtde de Títulos Renegociados",
        value: "quantidadeTitulos",
        sortable: false,
      },
      {
        text: "Total Pago na Renegociação",
        value: "totalPago",
        sortable: false,
      },
    ],
    headerTitles: [
      {
        text: "Título Renegociado",
        value: "numeroTituloRenegociado",
        sortable: false,
      },
      { text: "Parcela", value: "parcela", sortable: false },
      { text: "Data  Vencimento", value: "vencimento", sortable: false },
      {
        text: "Valor Original do Título	",
        value: "valorOriginalTitulo",
        sortable: false,
      },
      { text: "Juros", value: "juros", sortable: false },
      { text: "Multa", value: "multa", sortable: false },
      { text: "Valor Atualizado", value: "valorAtualizado", sortable: false },
    ],
    headerPayments: [
      {
        text: "Forma de Pagamento",
        value: "descricaoTipoPagamento",
        sortable: false,
      },
      { text: "Administradora", value: "administradora", sortable: false },
      { text: "Valor", value: "valor", sortable: false },
      {
        text: "Qtde de Parcelas",
        value: "quantidadeParcelas",
        sortable: false,
      },
      { text: "Data do Pagamento", value: "dataPagamento", sortable: false },
      {
        text: "Lançamento Contábil",
        value: "lancamentoContabil",
        sortable: false,
      },
      { text: "Nº Autorização", value: "numeroAutorizacao", sortable: false },
      { text: "NSU", value: "nsu", sortable: false },
    ],

    dialogTitle: "",
  }),
  created() {
    this.loadAll();
  },

  methods: {
    loadAll() {
      axios
        .get("https://localhost:44347/api/cliente")
        .then((response) => {
          this.clientList = response.data;
        })
        .catch((error) => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => (this.loading = false));
    },
    loadDetailClient(id) {
      const param = id;

      axios
        .get("https://localhost:44347/api/cliente/" + param)
        .then((response) => {
          this.detailClient = response.data;
          this.detailTitleList = response.data[0].titulos;
          this.detailPaymentList = response.data[0].formaPagamentos;

          this.detailClientExcel = JSON.stringify(response.data);
        })
        .catch((error) => {
          console.log(error);
          this.errored = true;
        });
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [day, month, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    reportFilter() {},
    openDialogDetailClientReport(item) {
      this.dialog = true;

      this.loadDetailClient(item.id);
    },
    openDialogPDF(item) {
      this.loadDetailClient(item.id);
      this.createPDF();
    },

    createPDFList() {
      var columns = [
        { title: "Title", dataKey: "codigoCliente" },
        { title: "Nome", dataKey: "nome" },
        { title: "Cnpj", dataKey: "cnpj" },
        { title: "Quantidade Titulos", dataKey: "quantidadeTitulos" },
        { title: "Total Pago", dataKey: "totalPago" },
      ];

      var clientList = this.clientList;
      var doc = new jsPDF("p", "pt");
      doc.text("To Do List", 40, 40);

      doc.autoTable(columns, clientList, {
        margin: { top: 60 },
      });

      doc.save("todos.pdf");
    },

    createPDFDetail(item) {
      this.loadDetailClient(item.id);

      var headerClient = [
        { title: "", dataKey: "codigoCliente" },
        { title: "", dataKey: "nome" },
        { title: "Cnpj", dataKey: "cnpj" },
        { title: "Quantidade Titulos", dataKey: "quantidadeTitulos" },
        { title: "Total Pago", dataKey: "totalPago" },
      ];

      var headerTitle = [
        { title: "Título", dataKey: "numeroTituloRenegociado" },
        { title: "Parcela", dataKey: "parcela" },
        { title: "Data  Vencimento", dataKey: "vencimento" },
        { title: "Valor Original do Título", dataKey: "valorOriginalTitulo" },
        { title: "Juros", dataKey: "juros" },
        { title: "Multa", dataKey: "multa" },
        { title: "Valor Atualizado", dataKey: "valorAtualizado" },
      ];

      var headerPayment = [
        { title: "Forma de Pagamento", dataKey: "descricaoTipoPagamento" },
        { title: "Administradora", dataKey: "administradora" },
        { title: "Valor", dataKey: "valor" },
        { title: "Qtde de Parcelas", dataKey: "quantidadeParcelas" },
        { title: "Data do Pagamento", dataKey: "dataPagamento" },
        { title: "Lançamento Contábil", dataKey: "lancamentoContabil" },
        { title: "Nº Autorização", dataKey: "numeroAutorizacao" },
        { title: "NSU", dataKey: "nsu" },
      ];

      var doc = new jsPDF("p", "pt", "a4");

      var imgData =
        "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";

      doc.addImage(imgData, "JPG", 33, 10, 40, 40); //base64 image, format, x-coordinate, y-coordinate, width, height

      doc.autoTable(headerClient, this.detailClient, {
        margin: { top: 80 },
      });

      doc.autoTable(headerTitle, this.detailTitleList, {
        margin: { top: 60 },
      });

      doc.autoTable(headerPayment, this.detailPaymentList, {
        margin: { top: 60 },
      });

      const addFooters = (doc) => {
        const pageCount = doc.internal.getNumberOfPages();

        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        for (var i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.text(
            "Pagina " + String(i) + " de " + String(pageCount),
            doc.internal.pageSize.width / 2,
            287,
            {
              align: "center",
            }
          );
        }
      };

      addFooters(doc);

      doc.save("Teste" + ".pdf");
    },
    closeDialogPDF() {
      this.dialogPdf = false;
    },
    close() {
      this.dialog = false;
    },
  },

  computed: {
    dtLancamentoInicialFormat() {
      return this.formatDate(this.dtInicial);
    },
    dtLancamentoFinalFormat() {
      return this.formatDate(this.dtFinal);
    },
    computedDateFormatted() {
      return this.formatDate(this.date);
    },
  },

  watch: {
    date(val) {
      if (!val) {
        this.dateFormatted = this.formatDate(this.date);
      }
    },
    dialog(val) {
      val || this.close();
    },
  },
};
</script>

<style>
#tableClientInternal .v-data-table-header {
  background-color: rgb(242, 242, 242);
  color: white;
}
#tablePrincipal .v-data-table-header {
  background-color: rgb(230, 238, 255);
  color: white;
}

#tableTitles .v-data-table-header {
  background-color: rgb(255, 255, 179);
  color: white;
}

#tablePayments .v-data-table-header {
  background-color: rgb(230, 238, 255);
  color: white;
}

#btnActions {
  margin-left: 92px;
}
#btnCancel {
  margin-left: 320px;
}
</style>
