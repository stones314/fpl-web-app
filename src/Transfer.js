import { FIXTURES, IMG } from "./Data.js"

export class Transfer {
    constructor(pos, in_team, gw, id) {
        this.pos = pos;
        this.in_team = in_team;
        this.id = id;
        this.gw = gw;
    }
    set_in_team(in_team) {
        this.in_team = in_team;
    }
}

export class TransferList {
    constructor(cookie_data = null) {
        this.gws = [];
        for (var i = 0; i < 38; i++) {
            this.gws.push([])
            if (cookie_data) {
                for (const [j, trans] of cookie_data.gws[i].entries())
                    this.gws[i].push(new Transfer(trans.pos, trans.in_team, trans.gw, trans.id));
            }
        }
    }
    add_transfer(gw, pos, in_team, id) {
        // see if we update an existing transfer first:
        for (const [i, trans] of this.gws[gw - 1].entries()) {
            if (trans.pos === pos && trans.id === id) {
                this.gws[gw - 1][i].set_in_team(in_team);
                return;
            }
        }

        this.gws[gw - 1].push(new Transfer(pos, in_team, gw, id));
    }
    del_transfer(gw, id) {
        // see if we update an existing transfer first:
        this.gws[gw - 1].splice(id, 1);
    }
    get_transfers(gw) {
        return this.gws[gw - 1]
    }
}

export function TransferView(props) {
    if (props.transfers.length === 0) return null;
    var trans_list = []
    for (const [i, trans] of props.transfers.entries()) {
        // if (props.out_trans.length >= i)break;
        if (props.out_trans[i].out_team === trans.in_team) continue;
        trans_list.push(
            <div className="row center" key={i}>
                <div className={"f1 mlr3"}>
                    {trans.pos + (trans.id + 1).toString() + "  "}
                </div>
                <div className={"f1 mlr3 fdr_" + FIXTURES[props.out_trans[i].out_team][trans.gw - 1].fdr}>
                    <img className={"shirt trans-mid"}
                        src={IMG[props.out_trans[i].out_team]}
                        alt={props.out_trans[i].out_team}
                    />
                </div>
                <div className={"f1 mlr3"}>
                    {" > "}
                </div>
                <div className={"f1 mlr3 fdr_" + FIXTURES[trans.in_team][trans.gw - 1].fdr}>
                    <img className={"shirt trans-mid"}
                        src={IMG[trans.in_team]}
                        alt={trans.in_team}
                    />
                </div>
                <div className={"f1 mlr3 brd cp"} onClick={() => props.onDelTrans(trans.gw, i)}>
                    DEL
                </div>
            </div>
        )
    }
    return (
        <div className="small_txt col">
            {trans_list.length > 0 ? "Transfers:" : null}
            {trans_list}
        </div>
    )
}