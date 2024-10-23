/* await this.mailerService.sendMail({
        to: confirmResultsDto.mailTo,
        from: 'developer@marco.com.pe',
        subject: `Resultados - Evaluación de desempeño ${survey.period.year}`,
        attachments: [
          {
            filename: 'logo completo.png',
            path: 'src/public/images/logo completo.png',
            cid: 'logo',
          }
        ],
        html: `
      <style>
        .ionic-table {
            width: 70%;
            border-collapse: collapse;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .ionic-table th {
            background-color: #f0f0f5;
            color: #333;
            text-align: left;
            padding: 12px;
            font-weight: bold;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 2px solid #e0e0e0;
        }

        .ionic-table td {
            padding: 12px;
            font-size: 14px;
            color: #444;
            border-bottom: 1px solid #e0e0e0;
        }

        .ionic-table tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        .ionic-table tr:hover {
            background-color: #e0e0f0;
        }

        .ionic-table td:first-child {
            font-weight: bold;
        }

        .contenedor-logo {
          width: 50%;
        }

      </style>
      <p>Estimad@ ${survey.userEvaluated.firstname} ${survey.userEvaluated.lastname},</p>
      <p>A continuación le presentamos sus resultados de la evaluación de desempeño:</p>
      <br>
      <p>Evaluador: ${survey.userEvaluator.firstname} ${survey.userEvaluator.lastname}</p>
      <h3>Objetivos</h3>
      <table class="ionic-table">
        <thead>
          <tr>
            <th></th>
            <th>Puntaje</th>
          </tr>
        </thead>
        <tbody>
          ${goalsRows}
          <tr>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Promedio</td>
            <td>${(totalGoalsValue / totalGoals).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      <br>
      <h3>Competencias</h3>
      <table class="ionic-table">
        <thead>
          <tr>
            <th></th>
            <th>Puntaje</th>
          </tr>
        </thead>
        <tbody>
          ${competenciesRows}
          <tr>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Promedio</td>
            <td>${(totalCompetenciesValue / totalCompetencies).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      <br>
      <p>Comentarios: ${survey.comentaries}</p>
      <p>Saludos,</p>
      <div class="contenedor-logo">
        <img src="cid:logo" width="250" />
      </div>
      `
      });

      const surveyUpdated = await this.surveySchema.findByIdAndUpdate(confirmResultsDto.surveyId, { isResultsDownloaded: true });

      return surveyUpdated; */