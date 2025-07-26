from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time
from selenium.webdriver.support.ui import Select

driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
wait = WebDriverWait(driver, 15)

def llenar_input(label_text, valor):
    input_xpath = f"//label[contains(text(),'{label_text}')]/following-sibling::input"
    input_elem = wait.until(EC.presence_of_element_located((By.XPATH, input_xpath)))
    input_elem.clear()
    input_elem.send_keys(valor)

def manejar_alerta():
    try:
        alert = WebDriverWait(driver, 5).until(EC.alert_is_present())
        print(f"[ALERTA]: {alert.text}")
        alert.accept()
        time.sleep(1)
    except:
        print("[INFO]: No apareció alerta o ya fue aceptada.")

try:
    driver.get("http://34.152.27.187/")
    time.sleep(1.5)
    print("[INFO]: Página principal cargada.")

    registrar_usuario_btn = wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//button[contains(text(),'Registrar Usuario')]")
    ))
    registrar_usuario_btn.click()
    print("[INFO]: Se hizo clic en 'Registrar Usuario'.")
    time.sleep(1.5)

    wait.until(EC.url_contains("/RegistrarUsuario"))
    print("[INFO]: Página de Registro de Usuario cargada.")

    llenar_input("Nombre", "Luis")
    llenar_input("Apellidos", "Del Valle")
    llenar_input("CUI", "1234567890123")
    llenar_input("Género", "M")
    llenar_input("Dirección", "Zona 10, Ciudad de Guatemala")
    llenar_input("Teléfono", "12345678")
    llenar_input("Fecha de nacimiento", "2000-01-01")
    llenar_input("Correo electrónico", "luis.ejemplo1@correo.com")
    llenar_input("Contraseña", "Contra12")
    llenar_input("DPI", "9876543210101")
    llenar_input("Foto", "https://drive.google.com/file/d/11HZvNd3cX5QIZa36GDOdtex2DmQrlSCY/view")
    time.sleep(1)

    crear_usuario_btn = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Crear usuario')]"))
    )
    crear_usuario_btn.click()
    print("[INFO]: Se hizo clic en 'Crear usuario'.")
    time.sleep(1.5)
    manejar_alerta()

    regresar_usuario = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Regresar')]"))
    )
    regresar_usuario.click()
    print("[INFO]: Se hizo clic en 'Regresar' desde registro de usuario.")
    wait.until(EC.url_to_be("http://34.152.27.187/"))
    time.sleep(1)

    registrar_empresa_btn = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Registrar Empresa')]"))
    )
    registrar_empresa_btn.click()
    print("[INFO]: Se hizo clic en 'Registrar Empresa'.")
    time.sleep(1.5)

    wait.until(EC.url_contains("/RegistrarEmpresa"))
    print("[INFO]: Página de Registro de Empresa cargada.")

    llenar_input("Nombre", "Tech Solutions")
    llenar_input("NIT", "54646546546")
    llenar_input("Dirección", "Zona 15, Guatemala")
    llenar_input("Teléfono", "44556677")
    llenar_input("Giro de negocio", "Tecnología")
    llenar_input("Correo electrónico", "empresa1@correoprueba.com")
    llenar_input("Contraseña", "Contra12")
    llenar_input("Foto", "https://drive.google.com/file/d/1O2sAC3K0bbXPZaMsNHnSFhd8TNTLGGYN/view")
    time.sleep(1)

    crear_empresa_btn = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Crear Empresa')]"))
    )
    crear_empresa_btn.click()
    print("[INFO]: Se hizo clic en 'Crear Empresa'.")
    time.sleep(1.5)
    manejar_alerta()

    regresar_empresa = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Regresar')]"))
    )
    regresar_empresa.click()
    print("[INFO]: Se hizo clic en 'Regresar' desde registro de empresa.")
    wait.until(EC.url_to_be("http://34.152.27.187/"))
    time.sleep(1)

    print("[ÉXITO]: Flujo completo de registro de usuario y empresa ejecutado correctamente.")
    
    login_btn = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Login')]"))
    )
    login_btn.click()
    print("[INFO]: Se hizo clic en 'Login'.")
    time.sleep(1.5)

    wait.until(EC.url_contains("/login"))
    print("[INFO]: Página de Login cargada.")

    input_email = wait.until(
        EC.presence_of_element_located((By.XPATH, "//input[@placeholder='E-mail']"))
    )
    input_password = wait.until(
        EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Password']"))
    )
    input_email.clear()
    input_email.send_keys("luis.ejemplo@correo.com")
    input_password.clear()
    input_password.send_keys("Contra12")
    print("[INFO]: Credenciales del usuario ingresadas.")
    time.sleep(1)

    login_submit = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Login')]"))
    )
    login_submit.click()
    print("[INFO]: Botón Login presionado.")
    time.sleep(2)

    manejar_alerta()

    wait.until(EC.url_contains("/InicioUsuario"))
    print("[INFO]: Login exitoso. Redirigido a InicioUsuario.")
    time.sleep(1)
    empresas_activas_btn = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Buscar Empresas')]"))
    )
    empresas_activas_btn.click()
    print("[INFO]: Se hizo clic en 'Buscar Empresas'.")
    wait.until(EC.url_contains("/empresas-activas"))
    print("[INFO]: Página de Empresas Activas cargada.")
    time.sleep(2)

    filas_empresas = wait.until(EC.presence_of_all_elements_located(
        (By.XPATH, "//table[contains(@class, 'user-table')]/tbody/tr")
    ))

    empresa_encontrada = False
    for fila in filas_empresas:
        columnas = fila.find_elements(By.TAG_NAME, "td")
        if columnas and "Empresa Golwer" in columnas[0].text:
            ver_puestos_btn = fila.find_element(By.XPATH, ".//button[contains(text(),'Ver Puestos')]")
            ver_puestos_btn.click()
            print("[INFO]: Se hizo clic en 'Ver Puestos' para 'Empresa Golwer'.")
            empresa_encontrada = True
            break

    if not empresa_encontrada:
        print("[ERROR]: No se encontró la empresa 'Empresa Golwer'.")
        driver.quit()
        exit()

    puestos_tabla = wait.until(EC.presence_of_element_located(
        (By.XPATH, "//div[contains(@class,'user-card')]//table[contains(@class, 'user-table')]")
    ))
    print("[INFO]: Tabla de puestos cargada.")

    filas_puestos = puestos_tabla.find_elements(By.XPATH, ".//tbody/tr")
    puesto_encontrado = False
    for fila in filas_puestos:
        columnas = fila.find_elements(By.TAG_NAME, "td")
        if columnas and columnas[0].text.strip() == "51":
            aplicar_btn = fila.find_element(By.XPATH, ".//button[contains(text(),'Aplicar')]")
            aplicar_btn.click()
            print("[INFO]: Se hizo clic en 'Aplicar' para el puesto con ID 51.")
            puesto_encontrado = True
            break

    if not puesto_encontrado:
        print("[ERROR]: No se encontró el puesto con ID 51.")
        driver.quit()
        exit()

    cv_input = wait.until(EC.presence_of_element_located((By.ID, "cv")))
    cv_link = "https://drive.google.com/file/d/1jMyQDXUD6Gt8mJ5wybN0aYB-zFclPiKa/view"
    cv_input.clear()
    cv_input.send_keys(cv_link)
    print("[INFO]: Se ingresó el link del CV.")

    enviar_btn = wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//button[contains(text(),'Enviar CV')]")
    ))
    enviar_btn.click()
    print("[INFO]: Se envió el CV.")
    time.sleep(5)

    volver_btn = wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//a[contains(text(),'Volver al inicio')]")
    ))
    volver_btn.click()
    print("[INFO]: Regresaste al inicio del usuario.")
    
    crear_resena_btn = wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//button[contains(text(),'Crear Reseña')]")
    ))
    crear_resena_btn.click()
    print("[INFO]: Se hizo clic en 'Crear Reseña'")
    wait.until(EC.url_contains("/crear-resena"))
    print("[INFO]: Página Crear Reseña cargada.")

    empresa_select = wait.until(EC.presence_of_element_located((By.ID, "empresa")))
    select_obj = Select(empresa_select)
    select_obj.select_by_visible_text("Empresa Golwer")
    print("[INFO]: Se seleccionó 'Empresa Golwer'.")

    tercera_estrella = wait.until(EC.presence_of_element_located((
        By.XPATH, "//div[@class='estrellas']/span[3]"
    )))
    tercera_estrella.click()
    print("[INFO]: Se seleccionó la tercera estrella (calificación 3).")

    comentario_textarea = wait.until(EC.presence_of_element_located((By.ID, "comentario")))
    comentario_textarea.clear()
    comentario_textarea.send_keys("La empresa finalizae el proceso muy rápido")
    print("[INFO]: Comentario ingresado.")

    enviar_btn = wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//button[contains(text(),'Enviar Reseña')]")
    ))
    enviar_btn.click()
    print("[INFO]: Se envió la reseña.")
    time.sleep(1)

    volver_inicio = wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//a[contains(text(),'Volver al inicio')]")
    ))
    volver_inicio.click()
    print("[INFO]: Regresaste al inicio del usuario.")

    reportar_btn = wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//button[contains(text(),'Reportar empresa')]")
    ))
    reportar_btn.click()
    print("[INFO]: Se hizo clic en 'Reportar empresa'.")
    wait.until(EC.url_contains("/report-company"))
    print("[INFO]: Página 'Reportar Empresa' cargada.")

    empresa_select = wait.until(EC.presence_of_element_located((By.ID, "usuario")))
    Select(empresa_select).select_by_visible_text("Empresa Golwer")
    print("[INFO]: Empresa 'Empresa Golwer' seleccionada.")

    categoria_select = wait.until(EC.presence_of_element_located((By.ID, "categoria")))
    Select(categoria_select).select_by_visible_text("Empresa Falsa")
    print("[INFO]: Categoría 'Empresa Falsa' seleccionada.")

    motivo_textarea = wait.until(EC.presence_of_element_located((By.ID, "motivo")))
    motivo_textarea.clear()
    motivo_textarea.send_keys("La empresa no tiene sede y solo rechaza solicitudes")
    print("[INFO]: Motivo del reporte ingresado.")

    enviar_btn = wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//button[contains(text(),'Enviar Reporte')]")
    ))
    enviar_btn.click()
    print("[INFO]: Se envió el reporte.")

except Exception as e:
    print(f"[ERROR]: Error en la automatización: {e}")

finally:
    driver.quit()
    print("[INFO]: Navegador cerrado.")
