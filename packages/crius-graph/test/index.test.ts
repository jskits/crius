import { graphParser } from "../src";
import SendSMS from "./log/SendSMS";
import SelectReceiver from "./log/SelectReceiver";

test("", () => {
  expect(graphParser([SendSMS, SelectReceiver])).toEqual(`
    digraph AC {
      subgraph cluster_SendSMS {
        label = "AC SendSMS";
        tooltip = "SendSMS";
        style=filled;
        color=lightgrey;
        node [style=filled,color=white];
    
        SendSMS_EntryPoint[label = "EntryPoint",tooltip = "user enter entrypoint"];
        
        SendSMS_EntryPoint -> SendSMS_Login[label = " 1ms"];
        SendSMS_Login[label = "Login"];
        SendSMS_NavigateToComposeText[label = "NavigateToComposeText",tooltip = "user navigate to compose text page"];
        
        SendSMS_Login -> SendSMS_NavigateToComposeText[label = " 0ms"];
        SendSMS_NavigateToComposeText[label = "NavigateToComposeText"];
        SendSMS_TextSmsMessage[label = "TextSmsMessage",tooltip = "user type xxx in input field"];
        
        SendSMS_NavigateToComposeText -> SendSMS_TextSmsMessage[label = " 0ms"];
        SendSMS_TextSmsMessage[label = "TextSmsMessage"];
        SendSMS_TextSmsMessage -> SendSMS_InputText[label = " 0ms"];
        SendSMS_InputText[label = "InputText"];
        SendSMS_InputText -> SendSMS_IT[label = " 0ms"];
        SendSMS_IT[label = "IT"];
        SendSMS_CheckSmsMessage[label = "CheckSmsMessage",tooltip = "user should see that input field text is xxx"];
        
        SendSMS_IT -> SendSMS_CheckSmsMessage[label = " 0ms"];
        SendSMS_CheckSmsMessage[label = "CheckSmsMessage"];
      }
    
      subgraph cluster_SelectReceiver {
        label = "AC SelectReceiver";
        tooltip = "SelectReceiver";
        style=filled;
        color=lightgrey;
        node [style=filled,color=white];
    
        SelectReceiver_EntryPoint[label = "EntryPoint",tooltip = "user enter entrypoint"];
        
        SelectReceiver_EntryPoint -> SelectReceiver_Login[label = " 0ms"];
        SelectReceiver_Login[label = "Login"];
        SelectReceiver_NavigateToComposeText[label = "NavigateToComposeText",tooltip = "user navigate to compose text page"];
        
        SelectReceiver_Login -> SelectReceiver_NavigateToComposeText[label = " 0ms"];
        SelectReceiver_NavigateToComposeText[label = "NavigateToComposeText"];
        SelectReceiver_PickSmsReceiver[label = "PickSmsReceiver",tooltip = "user select yyy in input field"];
        
        SelectReceiver_NavigateToComposeText -> SelectReceiver_PickSmsReceiver[label = " 0ms"];
        SelectReceiver_PickSmsReceiver[label = "PickSmsReceiver"];
        SelectReceiver_PickSmsReceiver -> SelectReceiver_PickList[label = " 0ms"];
        SelectReceiver_PickList[label = "PickList"];
        SelectReceiver_PickList -> SelectReceiver_UT[label = " 0ms"];
        SelectReceiver_UT[label = "UT"];
        SelectReceiver_CheckSmsReceiver[label = "CheckSmsReceiver",tooltip = "user should see that receiver field is yyy"];
        
        SelectReceiver_UT -> SelectReceiver_CheckSmsReceiver[label = " 0ms"];
        SelectReceiver_CheckSmsReceiver[label = "CheckSmsReceiver"];
      }
    
      start -> SendSMS_EntryPoint;
      SendSMS_CheckSmsMessage -> end;
    
      start -> SelectReceiver_EntryPoint;
      SelectReceiver_CheckSmsReceiver -> end;
    
      start [shape=box];
      end [shape=box];
    }
  `);
});
