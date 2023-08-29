
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
            if (trans.pos === pos && trans.id === id){
                this.gws[gw - 1][i].set_in_team(in_team);
                return;
            }
        }

        this.gws[gw - 1].push(new Transfer(pos, in_team, gw, id));
    }
    get_transfers(gw) {
        return this.gws[gw - 1]
    }
}

export function TransferView(props) {
    if (props.transfers.length === 0) return null;
    var trans_list = []
    for (const [i, trans] of props.transfers.entries()) {
        if(props.out_trans[i].out_team === trans.in_team) continue;
        trans_list.push(
            <div className="small_txt" key={i}>
                {trans.pos + (trans.id + 1).toString() + " : " + props.out_trans[i].out_team + " => " + trans.in_team}
            </div>
        )
    }
    return (
        <div className="small_txt col">
            {trans_list.length > 0? "Transfers:":null}
            {trans_list}
        </div>
    )
}