import bcrypt

def encriptar_contraseña(contraseña):
    # Codifica la contraseña a bytes
    contraseña_bytes = contraseña.encode('utf-8')
    # Genera el hash usando bcrypt
    hash_bytes = bcrypt.hashpw(contraseña_bytes, bcrypt.gensalt())
    # Devuelve el hash en formato utf-8
    return hash_bytes.decode('utf-8')

if __name__ == "__main__":
    contraseña = "Contra12"
    hash_resultado = encriptar_contraseña(contraseña)
    print(hash_resultado)
