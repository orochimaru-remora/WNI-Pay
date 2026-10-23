import { navigate, usePath } from "hookrouter";
import React from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { routePaths } from "../constants";
import BankIcon from "../img/bank.svg?react";
import BannerImage from "../img/logo.jpg";
import FundsIcon from "../img/funds.svg?react";
import ListIcon from "../img/list.svg?react";
import SettingsIcon from "../img/settings.svg?react";
import "./Navigation.scss";

interface INavigationProps {
  inGame: boolean;
  isBanker: boolean;
}

interface INavbarLink {
  active: boolean;
  title: string;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  path: string;
}

const Navigation: React.FC<INavigationProps> = ({ inGame, isBanker }) => {
  const currentPath = usePath();

  const navbarLinks: INavbarLink[] = [
    {
      path: routePaths.funds,
      active: inGame,
      title: "Funds",
      icon: FundsIcon
    },
    {
      path: routePaths.history,
      active: inGame,
      title: "History",
      icon: ListIcon
    },
    {
      path: routePaths.bank,
      active: inGame && isBanker,
      title: "Bank",
      icon: BankIcon
    },
    {
      path: routePaths.settings,
      active: inGame && isBanker,
      title: "Settings",
      icon: SettingsIcon
    }
  ];

  const goTo = (location: string) => () => navigate(location);

  return (
    <Navbar bg="light" variant="light" sticky="top" className="navigation mb-3">
      <Container className="d-flex align-items-center justify-content-between">
        <Navbar.Brand onClick={goTo("/")} className="mr-2 py-0">
          <img
            src={BannerImage}
            height="38"
            className="d-inline-block align-top nav-logo"
            alt="WNI Simulator Logo"
            style={{ cursor: "pointer", display: "block", borderRadius: "6px" }}
          />
        </Navbar.Brand>
        <Nav className="ml-auto nav-button-group" style={{ overflowY: "auto" }}>
          {navbarLinks
            .filter((link) => link.active)
            .map((link) => {
              const Icon = link.icon;
              const isActive = currentPath === link.path;
              return (
                <Nav.Link
                  key={link.path}
                  href="#"
                  onClick={goTo(link.path)}
                  active={isActive}
                  className="p-0"
                >
                  <Button
                    variant={isActive ? "primary" : "light"}
                    title={link.title}
                    className={`d-flex align-items-center icon-button ${isActive ? "active-nav-btn" : ""}`}
                  >
                    <Icon
                      style={{
                        height: 20,
                        width: 20,
                        fill: isActive ? "#ffffff" : "rgba(0,0,0,.75)",
                        display: "block"
                      }}
                    />
                    <span className="ml-1 d-none d-sm-inline">{link.title}</span>
                  </Button>
                </Nav.Link>
              );
            })}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Navigation;
