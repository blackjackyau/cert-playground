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
      {props.certs.map(cert =>
          (<tr>
            <td className="w-50">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{cert.cert.getSubject().str}</h5>
                <pre className="card-text text-break">{cert.cert.getInfo()}</pre>
              </div>
            </div>
            <ul className="list-group">
              <li className="list-group-item text-break">
                <a className="btn btn-primary" data-bs-toggle="collapse" href="#colPK" role="button" aria-expanded="false" aria-controls="colPK">
                  Public Key
                </a>
                <div className="collapse mt-1" id="colPK">
                  {cert.cert.getPublicKeyHex()}
                </div>
              </li>
              <li className="list-group-item text-break">
                <a className="btn btn-primary" data-bs-toggle="collapse" href="#colSignature" role="button" aria-expanded="false" aria-controls="colSignature">
                  Signature
                </a>
                <div className="collapse mt-1" id="colSignature">
                {cert.cert.getSignatureValueHex()}
                </div>
              </li>
            </ul>
            </td>
            <td className="w-50">
              <div>
                {cert.meta.selfSigned ? (<span class="badge bg-primary m-1">Self Signed</span>) : undefined}
                {cert.meta.caCert ? (<span class="badge bg-primary m-1">CA Cert</span>) : undefined}
                {cert.meta.signatureVerified ? (<span class="badge bg-success m-1">Signature Verified</span>) : (<span class="badge bg-danger">Signature Not Verified</span>)}
              {cert.meta.issuer ?
                (<div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Issuer <br/> {cert.meta.issuer.getSubject().str}</h5>
                    <pre className="card-text text-break">{cert.meta.issuer.getInfo()}</pre>
                  </div>
              </div>): (<span class="badge bg-danger m-1">No issuer found</span>)}
              </div>
            </td>
          </tr>
          )
      )}
    </tbody>
  </table>
  );
}