import {
  autorun,
  title,
  examples,
  Scenario,
  Given,
  When,
  Then,
} from "crius-test";
import Step from "./step";

@autorun(test)
@title("Send ${sms} with ${contactType} on compose text page")
class SendSMS extends Step {
  @(examples`
    | accountTag     | contactType      | sms       |
    | 'us'           | 'personal'       | 'aaa'     |
    | 'uk'           | 'company'        | 'bbb'     |
    | 'ca'           | 'all'            | 'xxx'     |
  `)
  run() {
    return (
      <Scenario desc="user enter entrypoint" action={EntryPoint}>
        <Given
          desc="user navigate to compose text page"
          action={NavigateToComposeText}
        />
        <When desc="user type ${sms} in input field" action={TextSmsMessage} />
        <Then
          desc="user should see that input field text is ${sms}"
          action={CheckSmsMessage}
        />
      </Scenario>
    );
  }
}

@autorun(test)
@title("Select a ${receiver} with ${contactType} on compose text page")
class SelectReceiver extends Step {
  @(examples`
    | accountTag     | contactType      | receiver    |
    | 'us'           | 'personal'       | 'fff'       |
    | 'uk'           | 'company'        | 'ddd'       |
    | 'ca'           | 'all'            | 'yyy'       |
  `)
  run() {
    return (
      <Scenario desc="user enter entrypoint" action={EntryPoint}>
        <Given
          desc="user navigate to compose text page"
          action={NavigateToComposeText}
        />
        <When
          desc="user select ${receiver} in input field"
          action={PickSmsReceiver}
        />
        <Then
          desc="user should see that receiver field is ${receiver}"
          action={CheckSmsReceiver}
        />
      </Scenario>
    );
  }
}

class EntryPoint extends Step {
  run() {
    return <Login />;
  }
}

const Login = () => {};

class PickList extends Step {
  static UT() {}
}

class InputText extends Step {
  static IT() {}
}

class NavigateToComposeText extends Step {}

class TextSmsMessage extends Step {
  run() {
    return (
      <>
        <InputText />
        <InputText.IT />
      </>
    );
  }
}

class CheckSmsMessage extends Step {}

class PickSmsReceiver extends Step {
  run() {
    return (
      <>
        <PickList />
        <PickList.UT />
      </>
    );
  }
}

class CheckSmsReceiver extends Step {}
