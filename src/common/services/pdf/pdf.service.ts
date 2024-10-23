import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { Survey } from 'src/survey/entities/survey.entity';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { ChartConfiguration } from 'chart.js';

@Injectable()
export class PdfService {

    getScoreScale(score: number) {
        if (score <= 13) {
            return 1;
        } else if (score >= 13 && score < 15) {
            return 2;
        } else if (score >= 15 && score < 17) {
            return 3;
        } else if (score >= 17 && score < 19) {
            return 4;
        } else if (score >= 19 && score < 20) {
            return 5;
        } else {
            return 0;
        }
    }

    getGrade(value: number) {
        switch (value) {
            case 1:
                return 11;
            case 2:
                return 13;
            case 3:
                return 15;
            case 4:
                return 17;
            case 5:
                return 19;
            default:
                return 0;
        }
    }

    getBackgroundColor(position: number) {
        switch (position) {
            case 0:
                return 'rgba(255, 99, 132, 0.2)';
            case 1:
                return 'rgba(255, 159, 64, 0.2)';
            case 2:
                return 'rgba(255, 205, 86, 0.2)';
            case 3:
                return 'rgba(75, 192, 192, 0.2)';
            case 4:
                return 'rgba(54, 162, 235, 0.2)';
            case 5:
                return 'rgba(153, 102, 255, 0.2)';
            case 6:
                return 'rgba(201, 203, 207, 0.2)';
        }
    }

    getBorderColor(position: number) {
        switch (position) {
            case 0:
                return 'rgb(255, 99, 132)';
            case 1:
                return 'rgb(255, 159, 64)';
            case 2:
                return 'rgb(255, 205, 86)';
            case 3:
                return 'rgb(75, 192, 192)';
            case 4:
                return 'rgb(54, 162, 235)';
            case 5:
                return 'rgb(153, 102, 255)';
            case 6:
                return 'rgb(201, 203, 207)';
        }
    }

    getCompetenciesLabel(score: number) {
        if (score <= 13) {
            return 'Debajo de lo esperado';
        } else if (score >= 13 && score < 15) {
            return 'Cumple parcialmente';
        } else if (score >= 15 && score < 17) {
            return 'Cumple';
        } else if (score >= 17 && score < 19) {
            return 'Destacado';
        } else if (score >= 19 && score < 20) {
            return 'Excelente';
        } else {
            return 'No contemplado';
        }
    }

    getGoalsLabel(score: number) {
        if (score <= 13) {
            return 'Claramente por debajo de lo esperado';
        } else if (score >= 13 && score < 15) {
            return 'Ligeramente por debajo de lo esperado';
        } else if (score >= 15 && score < 17) {
            return 'Cumple con lo requerido';
        } else if (score >= 17 && score < 19) {
            return 'Logeramente por encima de lo esperado';
        } else if (score >= 19 && score < 20) {
            return 'Claramente por encima de lo esperado';
        } else {
            return 'No contemplado';
        }
    }

    private async generateCompetenciesChart(competencies: [{ description: string, value: number }]): Promise<string> {
        const width = 450; // Ancho del gráfico
        const height = 250; // Alto del gráfico

        // Inicializamos Chart.js con ChartJSNodeCanvas
        const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

        let myLabels = [];
        let myData = [];

        competencies.forEach((competency) => {
            myLabels.push(competency.description);
            myData.push(this.getGrade(competency.value));
        });

        // Definimos la configuración del gráfico (en este caso, un gráfico de barras)
        const configuration: ChartConfiguration = {
            type: 'radar',
            data: {
                labels: myLabels,
                datasets: [
                    {
                        label: 'Competencias',
                        data: myData,
                        backgroundColor: 'rgba(0, 133, 152, 0.2)',
                        borderColor: 'rgba(0, 133, 152, 1)',
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    r: {
                        beginAtZero: true,
                        suggestedMax: 5, // Para que la escala sea consistente con la evaluación
                    },
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            },
        };

        // Generamos el gráfico como una imagen en formato base64
        const image = await chartJSNodeCanvas.renderToDataURL(configuration);

        return image; // Devolvemos la imagen en base64
    }

    private async generateDonutChart(achievedValue: number, colors: string[]) {
        const width = 450; // Ancho del gráfico
        const height = 250; // Alto del gráfico

        // Inicializamos Chart.js con ChartJSNodeCanvas
        const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

        const configuration: ChartConfiguration = {
            type: 'doughnut',
            data: {
                labels: ['Alcanzado', 'Restante'],
                datasets: [
                    {
                        data: [achievedValue, 19 - achievedValue],
                        backgroundColor: colors,
                        borderColor: colors,
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                    },
                },
            },
        };

        // Convertir el gráfico a imagen base64
        const image = await chartJSNodeCanvas.renderToDataURL(configuration);
        return image;
    }

    async generatePdf(survey: Survey): Promise<Object> {

        let competenciesBodyTable = [
            [
                { text: '' },
                { text: 'Nota', font: 'Oswald', alignment: 'center' },
                { text: 'Escala', font: 'Oswald', alignment: 'center' }
            ],
        ];

        let goalsBodyTable = [
            [
                { text: '' },
                { text: 'Nota', font: 'Oswald', alignment: 'center' },
                { text: 'Escala', font: 'Oswald', alignment: 'center' }
            ],
        ]

        let totalCompetencies: number = 0;
        const totalCompetenciesValue = survey.competencies.reduce((acc: number, competency: any) => {
            const grade = this.getGrade(competency.value);
            competenciesBodyTable.push(
                [
                    { text: competency.description, font: 'OswaldLight', alignment: 'left' },
                    { text: `${grade}`, font: 'OswaldLight', alignment: 'center' },
                    { text: this.getCompetenciesLabel(grade), font: 'OswaldLight', alignment: 'center' },
                ]
            )
            totalCompetencies++;
            return acc + this.getGrade(competency.value);
        }, 0)

        const promedioCompetencies = (totalCompetenciesValue / totalCompetencies).toFixed(2);

        competenciesBodyTable.push(
            [
                { text: 'PROMEDIO', font: 'Oswald', alignment: 'right' },
                { text: `${promedioCompetencies}`, font: 'Oswald', alignment: 'center' },
                { text: '' }
            ]
        );

        let totalGoals: number = 0;
        const totalGoalsValue = survey.goals.reduce((acc: number, goal: any) => {
            const grade = this.getGrade(goal.value);
            goalsBodyTable.push(
                [
                    { text: goal.description, font: 'OswaldLight', alignment: 'left' },
                    { text: `${grade}`, font: 'OswaldLight', alignment: 'center' },
                    { text: this.getGoalsLabel(grade), font: 'OswaldLight', alignment: 'left' },
                ]
            )
            totalGoals++;
            return acc + this.getGrade(goal.value);
        }, 0);


        const promedioGoals = (totalGoalsValue / totalGoals).toFixed(2);
        goalsBodyTable.push(
            [
                { text: 'PROMEDIO', font: 'Oswald', alignment: 'right' },
                { text: `${promedioGoals}`, font: 'Oswald', alignment: 'center' },
                { text: '' }
            ]
        );

        /* const chartCompetencies = await this.generateCompetenciesChart(survey.competencies);
        const chartGoals = await this.generateGoalsChart(survey.goals); */
        const promedioCompetenciesChart = await this.generateDonutChart(Number(promedioCompetencies), ['#ffd16a', '#ffe8b1']);
        const promedioGoalsChart = await this.generateDonutChart(Number(promedioGoals), ['#ff9c8c', '#ffcdc5']);
        const promedioTotalChart = await this.generateDonutChart(Number((Number(promedioCompetencies) + Number(promedioGoals)) / 2), ['#2284f6', '#9fcbf4']);


        const fonts = {
            Roboto: {
                normal: 'fonts/Roboto-Regular.ttf',
                bold: 'fonts/Roboto-Medium.ttf',
                italics: 'fonts/Roboto-Italic.ttf',
                bolditalics: 'fonts/Roboto-MediumItalic.ttf',
            },
            Oswald: {
                normal: 'fonts/Oswald-Regular.ttf',
                bold: 'fonts/Oswald-Medium.ttf',
            },
            OswaldLight: {
                normal: 'fonts/Oswald-Light.ttf'
            }
        };

        const printer = new PdfPrinter(fonts);

        const docDefinition: TDocumentDefinitions = {
            /* header: { text: `Resultado individual de evaluación de desempeño ${survey.period.year}`, style: 'header', alignment: 'center', marginTop: 20, font: 'Oswald' }, */
            header: {
                columns: [
                    { text: `Resultado individual de evaluación de desempeño ${survey.period.year}`, style: 'header', alignment: 'center', color: '#224e5d', marginTop: 15 }
                    /* { image: 'src/public/images/logo completo.png', width: 150, marginTop: 10, marginLeft: 15 } */
                ]
            },
            content: [
                {
                    marginTop: 35,
                    table: {
                        headerRows: 1,
                        widths: ['*', '*', '*', '*'],
                        body: [
                            [{ text: 'Nombre:', fillColor: '#224e5d', color: 'white', marginTop: 2, marginBottom: 2, marginLeft: 2, font: 'Oswald' }, { text: `${survey.userEvaluated.firstname} ${survey.userEvaluated.lastname}`, fillColor: '#e2e2e2', marginTop: 2, marginBottom: 2, font: 'Oswald' }, { text: 'Puesto:', fillColor: '#224e5d', color: 'white', marginTop: 2, marginBottom: 2, marginLeft: 2, font: 'Oswald' }, { text: `${survey.userEvaluated.position}`, fillColor: '#e2e2e2', marginTop: 2, marginBottom: 2, font: 'Oswald' }],
                            ['', '', '', ''],
                            [{ text: 'Área', fillColor: '#224e5d', color: 'white', marginTop: 2, marginBottom: 2, marginLeft: 2, font: 'Oswald' }, { text: `${survey.userEvaluated.area.label}`, fillColor: '#e2e2e2', marginTop: 2, marginBottom: 2, font: 'Oswald' }, { text: 'Evaluador:', fillColor: '#224e5d', color: 'white', marginTop: 2, marginBottom: 2, marginLeft: 2, font: 'Oswald' }, { text: `${survey.userEvaluator.firstname} ${survey.userEvaluator.lastname}`, fillColor: '#e2e2e2', marginTop: 2, marginBottom: 2, font: 'Oswald' }]
                        ],
                    },
                    layout: 'noBorders',
                    headlineLevel: 10
                },
                {
                    marginTop: 25,
                    columns: [
                        {
                            width: '*',
                            text: 'COMPETENCIAS',
                            bold: true,
                            font: 'Oswald'
                        },
                        {
                            width: '*',
                            text: 'OBJETIVOS',
                            bold: true,
                            font: 'Oswald'
                        }
                    ]
                },

                {
                    columns: [
                        {
                            width: '*',
                            table: {
                                widths: [110, 30, 60],
                                body: competenciesBodyTable,
                            },
                            layout: 'lightHorizontalLines'
                        },
                        {
                            width: '*',
                            table: {
                                widths: [110, 30, 60],
                                body: goalsBodyTable
                            },
                            layout: 'lightHorizontalLines'
                        }
                    ]

                },

                {
                    marginLeft: 75,
                    marginTop: 25,
                    table: {
                        widths: [80, 50, 80, 50, 80], // Ancho automático (puedes ajustarlo a un tamaño fijo si lo deseas)
                        body: [
                            [
                                { text: 'Competencias', alignment: 'center', font: 'Oswald' },
                                { text: '' },
                                { text: 'Objetivos', alignment: 'center', font: 'Oswald' },
                                { text: '' },
                                { text: 'Promedio total', alignment: 'center', font: 'Oswald' },
                            ],
                            [
                                {
                                    text: `${promedioCompetencies}`, // El número que quieres al centro
                                    alignment: 'center', // Centra el texto horizontalmente
                                    fontSize: 24, // Tamaño de fuente
                                    bold: true, // Negrita para destacar el número
                                    color: 'white', // Color del texto
                                    fillColor: '#ffd16a', // Color de fondo estilo PrimeNG (azul)
                                    margin: [0, 15, 0, 15] // Espaciado para hacer la tarjeta más alta
                                },
                                {
                                    text: '+',
                                    alignment: 'center',
                                    fontSize: 24,
                                    bold: true,
                                    margin: [0, 15, 0, 15]
                                },
                                {
                                    text: `${promedioGoals}`,
                                    alignment: 'center',
                                    fontSize: 24,
                                    bold: true,
                                    color: 'white',
                                    fillColor: '#ff9c8c',
                                    margin: [0, 15, 0, 15]
                                },
                                {
                                    text: '=',
                                    alignment: 'center',
                                    fontSize: 24,
                                    bold: true,
                                    margin: [0, 15, 0, 15]
                                },
                                {
                                    text: `${((Number(promedioCompetencies) + Number(promedioGoals)) / 2).toFixed(2)}`,
                                    alignment: 'center',
                                    fontSize: 24,
                                    bold: true,
                                    color: 'white',
                                    fillColor: '#2284f6',
                                    margin: [0, 15, 0, 15]
                                }
                            ]
                        ]
                    },
                    layout: 'noBorders' // Quitar los bordes de la tabla para que parezca una tarjeta
                },
                {
                    marginLeft: 40,
                    marginTop: 25,
                    columns: [
                        {
                            alignment: 'center',
                            width: 150,
                            image: promedioCompetenciesChart,
                        },
                        {
                            alignment: 'center',
                            width: 150,
                            image: promedioGoalsChart,
                        },
                        {
                            alignment: 'center',
                            width: 150,
                            image: promedioTotalChart,
                        }
                    ]
                },
                {
                    marginTop: 30,
                    table: {
                        headerRows: 1,
                        widths: [250, '*', 100],
                        body: [
                            [
                                { text: `Comentarios: ${survey.comentaries}`, fillColor: '#e2e2e2', font: 'OswaldLight', margin: [5, 0, 50, 50], alignment: 'left'},
                                { text: `${this.getCompetenciesLabel(Number(((Number(promedioCompetencies) + Number(promedioGoals)) / 2).toFixed(2)))}`, fontSize: 20, font: 'Oswald', alignment: 'right', marginTop: 10},
                                { image: `src/public/images/${this.getScoreScale(Number(((Number(promedioCompetencies) + Number(promedioGoals)) / 2).toFixed(2)))}.png`, alignment: 'right', width: 150 }
                            ]
                        ]
                    },
                    layout: 'noBorders'
                }
            ],
            footer: [
                /* { text: 'Documento generado mediante la aplicación de evaluación de desempeño - Marco Peruana SA ©', fontSize: 6, alignment: 'right', marginRight: 10 } */
                {
                    image: 'src/public/images/banner.png',
                    width: 500,
                    height: 40,
                    alignment: 'center',
                }
            ],
            styles: {
                header: {
                    fontSize: 16,
                    bold: true,
                    font: 'Oswald',
                },
                /* tableHeader: {
                    bold: true,
                    fontSize: 13,
                    color: 'black',
                }, */
            },
        };

        const pdfDoc = printer.createPdfKitDocument(docDefinition);

        const docsPath = path.join(__dirname, '../../../../..', 'src/public/docs', `${survey.period.year}`);
        const fileName = `${survey.userEvaluated.firstname}-${survey.userEvaluated.lastname}.pdf`;
        const publicFilePath = path.join('src/public/docs', `${survey.period.year}`, fileName);

        if (!fs.existsSync(docsPath)) {
            fs.mkdirSync(docsPath);
        }

        const pdfPath = path.join(docsPath, fileName);
        const writeStream = fs.createWriteStream(pdfPath);
        pdfDoc.pipe(writeStream);
        pdfDoc.end();

        return new Promise((resolve, reject) => {
            writeStream.on('finish', () => {
                resolve({ fileName: fileName, publicFilePath: publicFilePath }); // Devolver la ruta del archivo PDF
            });
            writeStream.on('error', (err) => {
                reject(err);
            });
        });
    }

}
