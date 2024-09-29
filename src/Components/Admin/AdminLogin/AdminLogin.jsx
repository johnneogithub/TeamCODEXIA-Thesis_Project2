import React from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../Config/firebase";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "../AdminLogin/AdminLoginStyle.css";
import logo_stmargaret from "../../Assets/StMargaret_Logo.jpg";
import logo_landscape from "../../Assets/PlanItFamIt Landspace Logo White-Bkg.png";
import { useAuth } from '../../../AuthContext';

function AdminLogin() {
  const history = useHistory();
  const { loginAsAdmin } = useAuth(); // Destructure loginAsAdmin from AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const emailVal = e.target.email.value;
    const passwordVal = e.target.password.value;

    if (emailVal === "stmrgrtdmn@gmail.com") {
      try {
        await signInWithEmailAndPassword(auth, emailVal, passwordVal);
        
        // After successful login, call loginAsAdmin
        loginAsAdmin();

        // Redirect to dashboard
        history.push("/Dashboard");
      } catch (error) {
        alert(error.message);
      }
    } else {
      alert("Unauthorized email address");
    }
  };

  return (
    <section className="bg-light p-3 p-md-4 p-xl-5 full-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-xxl-11">
            <div className="card border-light-subtle shadow-sm">
              <div className="row g-0">
                <div className="col-12 col-md-6">
                  <img
                    className="img-fluid rounded-start w-100 h-100 object-fit-cover"
                    loading="lazy"
                    src={logo_stmargaret}
                    alt="Admin login illustration"
                  />
                </div>
                <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                  <div className="col-12 col-lg-11 col-xl-10">
                    <div className="card-body p-3 p-md-4 p-xl-5">
                      <div className="text-center mb-4">
                        <img
                          className="image-fluid"
                          src={logo_landscape}
                          alt="PlanItFamIt Landscape Logo"
                          width="375"
                          height="87"
                        />
                      </div>
                      <h2 className="h4 text-center">Hello, Admin!</h2>
                      <h3 className="fs-6 fw-normal text-secondary text-center m-0">
                        Login with your email and password to access the admin dashboard.
                      </h3>
                      <form onSubmit={handleSubmit}>
                        <div className="form-floating mb-2">
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            id="email"
                            placeholder="name@example.com"
                            required
                          />
                          <label htmlFor="email" className="form-label">
                            Email
                          </label>
                        </div>
                        <div className="form-floating mb-2">
                          <input
                            type="password"
                            className="form-control"
                            name="password"
                            id="password"
                            placeholder="Password"
                            required
                          />
                          <label htmlFor="password" className="form-label">
                            Password
                          </label>
                        </div>
                        <div className="d-grid">
                          <button className="btn btn-dark btn-lg" type="submit">
                            Login to Dashboard
                          </button>
                        </div>
                      </form>
                      <div className="d-flex gap-2 gap-md-4 flex-column flex-md-row justify-content-md-center mt-5">
                        <a href="/Welcome" className="link-secondary text-decoration-none">
                          Go to Welcome Page
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminLogin;
