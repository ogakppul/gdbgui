/**
 * A component to display, in gory detail, what is
 * returned from gdb's machine interface. This displays the
 * data source that is fed to all components and UI elements
 * in gdb gui, and is useful when debugging gdbgui, or
 * a command that failed but didn't have a useful failure
 * message in gdbgui.
 */
import _ from "lodash";
import React from "react";
import { store } from "statorgfc";

type State = any;

class GdbMiOutput extends React.Component<{}, State> {
  static MAX_OUTPUT_ENTRIES = 500;
  _debounced_scroll_to_bottom: any;
  el: any;
  constructor() {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 1-2 arguments, but got 0.
    super();
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'connectComponentState' does not exist on... Remove this comment to see the full error message
    store.connectComponentState(this, ["gdb_mi_output"]);
    this._debounced_scroll_to_bottom = _.debounce(
      this._scroll_to_bottom.bind(this),
      300,
      {
        leading: true,
      }
    );
  }
  render() {
    return (
      <div>
        <button
          title="clear all mi output"
          className="pointer btn btn-default btn-xs"
          onClick={() => store.set("gdb_mi_output", [])}
        >
          clear output
          <span className="glyphicon glyphicon-ban-circle pointer" />
        </button>
        <div id="gdb_mi_output" className="otpt" style={{ fontSize: "0.8em" }}>
          {this.state.gdb_mi_output}
        </div>
      </div>
    );
  }
  componentDidMount() {
    this.el = document.getElementById("gdb_mi_output");
  }
  componentDidUpdate() {
    this._debounced_scroll_to_bottom();
  }
  _scroll_to_bottom() {
    this.el.scrollTop = this.el.scrollHeight;
  }
  static add_mi_output(mi_obj: any) {
    const newStr = JSON.stringify(mi_obj, null, 4)
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
      .replace(/[^(\\)]\\n/g)
      .replace("<", "&lt;")
      .replace(">", "&gt;");
    const gdbMiOutput = store.get("gdb_mi_output");

    while (gdbMiOutput.length > GdbMiOutput.MAX_OUTPUT_ENTRIES) {
      gdbMiOutput.shift();
    }
    gdbMiOutput.push(newStr);

    store.set("gdb_mi_output", gdbMiOutput);
  }
}

export default GdbMiOutput;