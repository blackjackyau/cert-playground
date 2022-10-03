
import CertAdditionalInfo from "cert-additional-info";

export default function CertTables(props) {
  return (
    <table class="table table-sm">
      <thead>
        <tr>
          <th scope="col">Cert</th>
          <th scope="col">Evaluation</th>
        </tr>
      </thead>
      <tbody>
        {props.certs.map((certResult, index) => {

          const cert = certResult.cert.cert;
          const pem = certResult.cert.pem;

          return (<tr>
            <td className="w-50">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{cert.getSubject().str}</h5>
                  <pre className="card-text text-break">{cert.getInfo()}</pre>
                </div>
                <CertAdditionalInfo cert={cert} pem={pem} id={`subject-${index}`}></CertAdditionalInfo>
              </div>
            </td>
            <td className="w-50">
              <li className="list-group-item">
                {certResult.meta.selfSigned ? (<span class="badge bg-primary m-1">Self Signed</span>) : undefined}
                {certResult.meta.caCert ? (<span class="badge bg-primary m-1">CA Cert</span>) : undefined}
                {certResult.meta.signatureVerified ? (<span class="badge bg-success m-1">Signature Verified</span>) : (<span class="badge bg-danger">Signature Not Verified</span>)}
                {certResult.meta.notExpired ? (<span class="badge bg-success m-1">Not Expired</span>) : (<span class="badge bg-danger">Expired</span>)}
              </li>
              <li className="list-group-item text-break">
                {certResult.meta.issuer ? (
                  <div>
                    <a className="btn btn-primary btn-sm" data-bs-toggle="collapse" href={`#colIssuer${index}`} role="button" aria-expanded="false" aria-controls={`colIssuer${index}`}>
                      Issuer Cert
                    </a><span class="m-2 badge bg-light text-dark">{certResult.meta.issuer.cert.getSubject().str}</span>
                    {certResult.meta.issuerFromPublicCa ? (<span class="badge bg-primary m-1">Public CA</span>) : undefined}
                    <div className="collapse mt-1" id={`colIssuer${index}`}>
                      <pre>{certResult.meta.issuer.cert.getInfo()}</pre>
                      <CertAdditionalInfo cert={certResult.meta.issuer.cert} pem={certResult.meta.issuer.pem} id={`issuer-${index}`}></CertAdditionalInfo>
                    </div>
                  </div>) : (<div>No Issuer Found</div>)
                }
              </li>
            </td>
          </tr>
          )
        }
        )}
      </tbody>
    </table>
  );
}