import { Button } from "@mui/material";
import { useAuthStore } from "../../store/main";


const Header = () => {

  const { isLoggedIn, logout } = useAuthStore(store => store)

  return (
    <div style={{
      height: 70,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      background: '#1976d2',
      justifyContent: 'center',
    }}>
      <div style={{
        maxWidth: 1280,
        paddingLeft: 30,
        paddingRight: 30,
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <p style={{ fontSize: 28, fontWeight: 'bold', color: 'white' }}>Parser</p>
          {isLoggedIn && <Button
            variant="contained"
            onClick={() => logout()}
            style={{ backgroundColor: '#1976d2' }}
          >
            Log Out
          </Button>}
      </div>
    </div>
  )
}

export default Header;
