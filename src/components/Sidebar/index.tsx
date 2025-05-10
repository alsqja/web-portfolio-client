import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

export const Sidebar = () => {
  const location = useLocation();

  return (
    <SidebarContainer>
      <NavItem
        to="/portfolio"
        active={location.pathname === "/portfolio" || location.pathname === "/"}
      >
        내 포트폴리오
      </NavItem>
      {/* <NavItem to="/stats" active={location.pathname === "/stats"}>
        통계
      </NavItem> */}
    </SidebarContainer>
  );
};

const SidebarContainer = styled.nav`
  width: 250px;
  height: calc(100vh - 100px);
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

const NavItem = styled(Link)<{ active: boolean }>`
  text-decoration: none;
  color: #333;
  font-size: 18px;
  padding: 10px 15px;
  border-radius: 5px;
  margin-bottom: 10px;
  transition: background 0.3s;
  background: ${(props) => (props.active ? "#007bff" : "transparent")};
  color: ${(props) => (props.active ? "white" : "#333")};

  &:hover {
    ${(props) => !props.active && `background: #e2e6ea;`}
  }
`;
