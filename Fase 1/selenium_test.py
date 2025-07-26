from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import os
import time

AUTH_FILE_PATH = os.path.abspath("C:\\Users\\luisd\\OneDrive\\Documentos\\ayd1_proyecto2_vj2025_g7\\auth.ayd1")

driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()))
wait = WebDriverWait(driver, 15)

def manejar_alerta(timeout=3):
    try:
        alert = WebDriverWait(driver, timeout).until(EC.alert_is_present())
        print(f"[ALERTA]: {alert.text}")
        alert.accept()
        time.sleep(1)
    except:
        pass

try:
    # 1. Ir a página principal
    driver.get("http://127.0.0.1:3000/")
    time.sleep(1.5)
    print("[INFO]: Página principal cargada.")

    # 2. Click en botón Login
    login_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Login')]")))
    login_btn.click()
    time.sleep(1.5)
    print("[INFO]: Se hizo clic en botón Login.")

    # 3. Ingresar credenciales admin
    input_email = wait.until(EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='E-mail']")))
    input_password = driver.find_element(By.XPATH, "//input[@placeholder='Password']")
    input_email.clear()
    input_email.send_keys("admin@gmail.com")
    time.sleep(1.5)
    input_password.clear()
    input_password.send_keys("ContrasenaSegura123")
    time.sleep(1.5)
    print("[INFO]: Credenciales de administrador ingresadas.")

    # 4. Click en botón Login para enviar
    login_submit = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Login')]")))
    login_submit.click()
    time.sleep(1.5)
    print("[INFO]: Se hizo clic en botón Login para enviar.")

    # Manejar alerta después login exitoso
    manejar_alerta()

    # 5. Esperar a página de verificación de segundo paso
    wait.until(EC.url_contains("/cargar_env"))
    time.sleep(1.5)
    print("[INFO]: Redirigido a la página de verificación de segundo paso.")

    # 6. Subir archivo auth.ayd1
    file_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='file']")))
    file_input.send_keys(AUTH_FILE_PATH)
    time.sleep(1.5)
    print("[INFO]: Archivo auth.ayd1 seleccionado para subir.")

    # 7. Click en botón Subir
    subir_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Subir')]")))
    subir_btn.click()
    time.sleep(2)
    print("[INFO]: Botón Subir presionado.")

    # Manejar alerta después de subir archivo
    manejar_alerta()

    # 8. Esperar que cargue /admin_menu
    wait.until(EC.url_contains("/admin_menu"))
    time.sleep(1.5)
    print("[INFO]: Página del menú de administrador cargada.")

    # 9. Click en "Empresas sin aprobar"
    empresas_sin_aprobar_btn = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//li[contains(text(),'Empresas sin aprobar')]"))
    )
    empresas_sin_aprobar_btn.click()
    time.sleep(2)
    print("[INFO]: Se ingresó a Empresas sin aprobar.")

    # 10. Click en "Actualizar Lista"
    actualizar_lista_btn = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Actualizar Lista')]"))
    )
    actualizar_lista_btn.click()
    time.sleep(2)
    print("[INFO]: Lista de empresas pendientes actualizada.")

    # 11. Click en "Regresar al menú"
    regresar_btn = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Regresar al menú')]"))
    )
    regresar_btn.click()
    time.sleep(2)
    print("[INFO]: Regresado al menú de administrador.")

    # 12. Click en "Cerrar Sesión"
    cerrar_sesion_btn = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//li[contains(text(),'Cerrar Sesión')]"))
    )
    cerrar_sesion_btn.click()
    time.sleep(2)
    print("[INFO]: Se presionó botón de Cerrar Sesión.")

    # Manejar alerta después logout
    manejar_alerta()

    # 13. Esperar redirección a "/"
    wait.until(EC.url_matches("http://127.0.0.1:3000/"))
    time.sleep(1)
    print("[INFO]: Redirigido al inicio tras logout.")

    print("[ÉXITO]: Automatización completa con manejo de alertas y logout exitoso.")

except Exception as e:
    print(f"[ERROR]: Error durante la automatización: {e}")

finally:
    driver.quit()
