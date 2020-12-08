
import { Line } from "vue-chartjs";
export default {
  mixins: [Line],
  props: {
    labels: {
      required: true,
      type: Array,
      default: null
    },
    data: {
      required: true,
      type: Array,
      default: null
    }
  },
  mounted() {
    this.renderChart(
      {
        labels: this.labels,
        datasets: [
          {
            label: "sales ( € )",
            data: this.data,
            backgroundColor: "#6fcf97",
            borderColor: "#6fcf97",
            pointBackgroundColor: "#6fcf97"
          }
        ]
      },
      {
        responsive: true,
        maintainAspectRatio: false,
      }
    );
  }
};
