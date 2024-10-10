function getHumanReadableErrorMessage(error: any) {
  if (error.code === "auth/invalid-email") {
    return "E-mail inválido";
  } else if (error.code === "auth/user-not-found") {
    return "Usuário não encontrado";
  } else if (error.code === "auth/wrong-password") {
    return "Senha incorreta";
  } else if (error.code === "auth/popup-blocked") {
    return "O popup foi bloqueado. Por favor, habilite os popups e tente novamente";
  } else {
    return "Algo deu errado";
  }
}

export { getHumanReadableErrorMessage };
