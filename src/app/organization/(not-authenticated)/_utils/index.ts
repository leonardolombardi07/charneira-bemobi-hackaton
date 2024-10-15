function getHumanReadableErrorMessage(error: any) {
  console.log("error", error);
  console.log("error.code", error.code);
  console.log("error.message", error.message);

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
