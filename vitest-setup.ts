import { expect } from 'vitest'
import { Either } from './src/core/either' 

interface CustomMatchers<R = unknown> {
  toBeRight(): R
  toBeLeft(): R
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}

expect.extend({
  toBeRight(received: Either<any, any>) {
    const isPassing = received.isRight()
    const value = received.value

    return {
      pass: isPassing,
      message: () => {
        if (isPassing) return `Esperava que o resultado NÃO fosse Right, mas ele foi.`

        // Se o erro for uma classe (Error), extraímos a mensagem e o nome
        const errorDetails = value instanceof Error 
          ? { error: value.constructor.name, message: value.message }
          : value

        return (
          `\n❌ TEST FAILED: Expected a SUCCESS result (Right), but received an ERROR (Left).\n\n` +
          `🔍 ORIGIN OF THE ERROR: ${JSON.stringify(errorDetails, null, 2)}\n` +
          `----------------------------------------------------\n`
        )
      },
    }
  },

  toBeLeft(received: Either<any, any>) {
    const isPassing = received.isLeft()
    const value = received.value

    return {
      pass: isPassing,
      message: () =>
        isPassing
          ? ` expected the result NOT to be Left, but he was.`
          : `Expected Left (Erro), but received Right (Sucess).\n Right Content: ${JSON.stringify(value, null, 2)}`,
    }
  },
})