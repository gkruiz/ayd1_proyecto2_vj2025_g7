import oracledb
import os


def get_oracle_connection():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    wallet_path = os.path.join(base_dir, 'recursos', 'Wallet_Grupo7')
    
    connection = oracledb.connect(
        user="FASEDOS",
        password="Contrasena123",
        dsn="grupo7_high",
        config_dir=wallet_path,
        wallet_location =wallet_path,
        wallet_password = "Grupo123"
    )
    return connection

'''
base_dir = os.path.dirname(os.path.abspath(__file__))
wallet_path = os.path.join(base_dir, 'recursos', 'Wallet_Grupo7')
print("WALLET PATH:", wallet_path)

'''
