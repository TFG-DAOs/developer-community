import React from "react";
import Sidebar from "react-sidebar";

class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebarOpen: false
        };
        this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    }

    onSetSidebarOpen(open) {
        this.setState({ sidebarOpen: open });
    }

    render() {
        return (
            <Sidebar
                sidebar={<div><b>Sidebar content</b><b>Sidebar content</b><b>Sidebar content</b><b>Sidebar content</b><b>Sidebar content</b><b>Sidebar content</b><b>Sidebar content</b><b>Sidebar content</b></div>}
                open={this.state.sidebarOpen}
                onSetOpen={this.onSetSidebarOpen}
                styles={{ sidebar: { background: "white" } }}
            >
                <button onClick={() => this.onSetSidebarOpen(true)}>
                    Open sidebar
                </button>
            </Sidebar>
        );
    }
}

export default SideBar;