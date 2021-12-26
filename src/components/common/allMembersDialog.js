import { Grid, Menu } from "@material-ui/core"
import CustomAvatar from "./avatar"

function AllMembersDialog({ members, handleClose, anchorEl }) {
    const open = Boolean(anchorEl)
    console.log(members)
    return (
        <Menu
            open={open}
            anchorEl={anchorEl}
            id="basic-menu"
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
            <div style={{ width: 250, height: 250, padding: 10, overflowY: "scroll" }}>
                <h3>All members</h3>
                <Grid container>

                    {members.map((member, i) => {
                        return (
                            <Grid key={i} item xs={3}>
                                <CustomAvatar user={member} disableRipple />
                            </Grid>
                        )
                    })}
                </Grid>
            </div>

        </Menu >
    )
}

export default AllMembersDialog

