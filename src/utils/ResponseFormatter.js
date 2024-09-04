const Util = require("./utils");

class ResponseFormatter {
    /**
     * Formata uma resposta de sucesso
     * @param {Object} data - Dados da resposta
     * @param {String} message - Mensagem opcional
     * @returns {Object} - Objeto JSON formatado
     */
    static success(data = {}, message = null) {
      return {
        status: 'success',
        message,
        data, // Mantém os dados no mesmo campo
      };
    }
  
    /**
     * Formata uma resposta de erro
     * @param {String} message - Mensagem de erro
     * @param {Object} data - Detalhes do erro
     * @param {Number} statusCode - Código de erro HTTP
     * @returns {Object} - Objeto JSON formatado
     */
    static error(dialog = null, message = null, data = null, stack = null, statusCode = 500) {
      var response = {
        status: 'error',
        message,
        data, // Usa o mesmo campo 'data' para manter a consistência
        dialog,
        stack, // Inclui stack de erro
        statusCode, // Inclui o código de status para facilitar a depuração
      };
      if (!Util.env.isDev)
        delete response.stack
      return response
    }
  
    /**
     * Formata uma resposta de falha de validação
     * @param {Array} errors - Lista de erros de validação
     * @param {String} message - Mensagem opcional
     * @returns {Object} - Objeto JSON formatado
     */
    static validation(errors = [], message = 'Validation failed') {
      return {
        status: 'fail',
        message,
        data: { errors }, // Mantém erros dentro do campo 'data' para consistência
      };
    }

    /**
     * Formata uma resposta de falha de validação
     * @param {Array} errors - Lista de erros de validação
     * @param {String} message - Mensagem opcional
     * @returns {Object} - Objeto JSON formatado
     */
    static dialog(message, title='Ops', button='Entendi') {
        return {
            title,
            message,
            button
        };
      }

    static responseError(res, error, statusCode=500) {
        res.status(statusCode).json(ResponseFormatter.error(ResponseFormatter.dialog(error.message), null, null, error.stack))
    }
  }
  
  module.exports = ResponseFormatter;