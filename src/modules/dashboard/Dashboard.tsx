import Sider from "antd/es/layout/Sider";
import { Header, Content, Footer } from "antd/es/layout/layout";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import React from "react";

const { Header, Content, Footer, Sider } = Layout;

function Dashboard() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={200}>
        <MenyDynamic/>
      </Sider>

      <Layout>
        <Header />
        <Content style={{ margin: "24px 16px 0", padding: 24, background: "#fff", minHeight: 280 }}>
          <Outlet />
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
}

export default Dashboard;
