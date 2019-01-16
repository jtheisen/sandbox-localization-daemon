import * as React from "react"
import { render } from "react-dom"
import * as Pt from "@blueprintjs/core"
import * as Pts from "@blueprintjs/select"
import { observer } from "mobx-react"
import { observable } from "mobx"
import { IconNames } from "@blueprintjs/icons"
import * as Daemon from "./daemon"

import "@blueprintjs/core/lib/css/blueprint.css"
import "@blueprintjs/icons/lib/css/blueprint-icons.css"

Pt.FocusStyleManager.onlyShowFocusOnTabs()

const root = document.getElementById("root")

Daemon.initialize(root)

@observer
class Demo extends React.Component {
  @observable
  clickedA: number = 0

  @observable
  clickedB: number = 0

  render() {
    console.info("demo render")
    return (
      <div>
        <Pt.Tabs id="tabs" renderActiveTabPanelOnly={true}>
          <Pt.Tab
            id="tab1"
            title="first"
            panel={
              <div>
                <span>Hello</span>{" "}
                <span>{this.clickedA % 2 === 0 ? "World" : "Sun"}</span>
              </div>
            }
          />
          <Pt.Tab
            id="tab2"
            title="second"
            panel={
              <div>
                <span>Goodbye</span> <span>man</span>
              </div>
            }
          />
        </Pt.Tabs>
        <div style={{ marginTop: 40 }}>
          <Pt.ButtonGroup>
            <Pt.Button children="A" onClick={() => this.clickedA++} />
            <Pt.Button children="B" onClick={() => this.clickedB++} />
            <Pt.Button
              children="wipe"
              onClick={() => {
                try {
                  Daemon.switchTextTo("World", "Welt")
                } catch (ex) {
                  console.info("Exception: " + ex)
                }
              }}
            />
          </Pt.ButtonGroup>
        </div>
      </div>
    )
  }
}

render(<Demo />, root)
