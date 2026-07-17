const MAX_TEXT_LENGTH = 5000;
const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const B64_INDEX_HTML = "PCFkb2N0eXBlIGh0bWw+CjxodG1sIGxhbmc9ImVuIj4KICA8aGVhZD4KICAgIDxtZXRhIGNoYXJzZXQ9InV0Zi04Ij4KICAgIDxtZXRhIG5hbWU9InZpZXdwb3J0IiBjb250ZW50PSJ3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MSI+CiAgICA8bWV0YSBuYW1lPSJ0aGVtZS1jb2xvciIgY29udGVudD0iIzBmNzY2ZSI+CiAgICA8dGl0bGU+RVQgQnVzaW5lc3MgVHJhbnNsYXRvcjwvdGl0bGU+CiAgICA8bGluayByZWw9InN0eWxlc2hlZXQiIGhyZWY9Ii9zdHlsZXMuY3NzIj4KICA8L2hlYWQ+CiAgPGJvZHk+CiAgICA8bWFpbiBjbGFzcz0iYXBwLXNoZWxsIj4KICAgICAgPGhlYWRlciBjbGFzcz0idG9wYmFyIj4KICAgICAgICA8ZGl2PgogICAgICAgICAgPHAgY2xhc3M9ImV5ZWJyb3ciPkVUIEJ1c2luZXNzIFRyYW5zbGF0b3I8L3A+CiAgICAgICAgICA8aDE+RW5nbGlzaCDih4QgQ2hpbmVzZTwvaDE+CiAgICAgICAgPC9kaXY+CiAgICAgICAgPGRpdiBjbGFzcz0ic3RhdHVzLXBpbGwiIGlkPSJjb25uZWN0aW9uU3RhdHVzIj5SZWFkeTwvZGl2PgogICAgICA8L2hlYWRlcj4KCiAgICAgIDxzZWN0aW9uIGNsYXNzPSJ0cmFuc2xhdG9yLWdyaWQiIGFyaWEtbGFiZWw9IlRyYW5zbGF0b3IiPgogICAgICAgIDxmb3JtIGNsYXNzPSJwYW5lbCBpbnB1dC1wYW5lbCIgaWQ9InRyYW5zbGF0b3JGb3JtIj4KICAgICAgICAgIDxkaXYgY2xhc3M9ImZpZWxkLWhlYWQiPgogICAgICAgICAgICA8bGFiZWwgZm9yPSJzb3VyY2VUZXh0Ij5UZXh0PC9sYWJlbD4KICAgICAgICAgICAgPHNwYW4gaWQ9ImNoYXJDb3VudCI+MCAvIDUwMDA8L3NwYW4+CiAgICAgICAgICA8L2Rpdj4KICAgICAgICAgIDx0ZXh0YXJlYQogICAgICAgICAgICBpZD0ic291cmNlVGV4dCIKICAgICAgICAgICAgbmFtZT0ic291cmNlVGV4dCIKICAgICAgICAgICAgcm93cz0iMTAiCiAgICAgICAgICAgIG1heGxlbmd0aD0iNTAwMCIKICAgICAgICAgICAgc3BlbGxjaGVjaz0idHJ1ZSIKICAgICAgICAgICAgcGxhY2Vob2xkZXI9IlBhc3RlIGEgd29yayBjaGF0LCBtZWV0aW5nIG5vdGUsIFBSRCBsaW5lLCBvciBlbWFpbCBzZW50ZW5jZS4iCiAgICAgICAgICA+PC90ZXh0YXJlYT4KCiAgICAgICAgICA8ZGl2IGNsYXNzPSJjb250cm9sLXJvdyI+CiAgICAgICAgICAgIDxkaXY+CiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9ImNvbnRyb2wtbGFiZWwiPkRpcmVjdGlvbjwvc3Bhbj4KICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSJzZWdtZW50ZWQgdHdvLXdheSIgaWQ9ImRpcmVjdGlvbkNvbnRyb2wiIHJvbGU9Imdyb3VwIiBhcmlhLWxhYmVsPSJUcmFuc2xhdGlvbiBkaXJlY3Rpb24iPgogICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPSJidXR0b24iIGNsYXNzPSJzZWdtZW50IGFjdGl2ZSIgZGF0YS1kaXJlY3Rpb249ImVuLXpoIj5FTiDihpIg5Lit5paHPC9idXR0b24+CiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9ImJ1dHRvbiIgY2xhc3M9InNlZ21lbnQiIGRhdGEtZGlyZWN0aW9uPSJ6aC1lbiI+5Lit5paHIOKGkiBFTjwvYnV0dG9uPgogICAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgICA8L2Rpdj4KCiAgICAgICAgICAgIDxkaXY+CiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9ImNvbnRyb2wtbGFiZWwiPlRvbmU8L3NwYW4+CiAgICAgICAgICAgICAgPGRpdiBjbGFzcz0ic2VnbWVudGVkIiBpZD0idG9uZUNvbnRyb2wiIHJvbGU9Imdyb3VwIiBhcmlhLWxhYmVsPSJUb25lIj4KICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT0iYnV0dG9uIiBjbGFzcz0ic2VnbWVudCBhY3RpdmUiIGRhdGEtdG9uZT0iYnVzaW5lc3MiPkJ1c2luZXNzPC9idXR0b24+CiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9ImJ1dHRvbiIgY2xhc3M9InNlZ21lbnQiIGRhdGEtdG9uZT0icGxhaW4iPlBsYWluPC9idXR0b24+CiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9ImJ1dHRvbiIgY2xhc3M9InNlZ21lbnQiIGRhdGEtdG9uZT0icG9saXNoZWQiPlBvbGlzaGVkPC9idXR0b24+CiAgICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgPC9kaXY+CgogICAgICAgICAgPGxhYmVsIGNsYXNzPSJjb250ZXh0LWxhYmVsIiBmb3I9ImNvbnRleHRUZXh0Ij5Db250ZXh0PC9sYWJlbD4KICAgICAgICAgIDxpbnB1dAogICAgICAgICAgICBpZD0iY29udGV4dFRleHQiCiAgICAgICAgICAgIG5hbWU9ImNvbnRleHRUZXh0IgogICAgICAgICAgICB0eXBlPSJ0ZXh0IgogICAgICAgICAgICBtYXhsZW5ndGg9IjEwMDAiCiAgICAgICAgICAgIHBsYWNlaG9sZGVyPSJPcHRpb25hbDogbWVldGluZywgV2VDaGF0LCBQUkQsIHZlbmRvciBlbWFpbCIKICAgICAgICAgID4KCiAgICAgICAgICA8ZGl2IGNsYXNzPSJhY3Rpb24tcm93Ij4KICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPSJzdWJtaXQiIGNsYXNzPSJwcmltYXJ5LWJ1dHRvbiIgaWQ9InRyYW5zbGF0ZUJ1dHRvbiI+VHJhbnNsYXRlPC9idXR0b24+CiAgICAgICAgICAgIDxidXR0b24gdHlwZT0iYnV0dG9uIiBjbGFzcz0iZ2hvc3QtYnV0dG9uIiBpZD0icGFzdGVCdXR0b24iPlBhc3RlPC9idXR0b24+CiAgICAgICAgICAgIDxidXR0b24gdHlwZT0iYnV0dG9uIiBjbGFzcz0iZ2hvc3QtYnV0dG9uIiBpZD0iY2xlYXJCdXR0b24iPkNsZWFyPC9idXR0b24+CiAgICAgICAgICA8L2Rpdj4KICAgICAgICAgIDxwIGNsYXNzPSJlcnJvci10ZXh0IiBpZD0iZXJyb3JUZXh0IiByb2xlPSJhbGVydCI+PC9wPgogICAgICAgIDwvZm9ybT4KCiAgICAgICAgPHNlY3Rpb24gY2xhc3M9InBhbmVsIG91dHB1dC1wYW5lbCIgYXJpYS1sYWJlbD0iVHJhbnNsYXRpb24gcmVzdWx0Ij4KICAgICAgICAgIDxkaXYgY2xhc3M9InJlc3VsdC1oZWFkIj4KICAgICAgICAgICAgPGRpdj4KICAgICAgICAgICAgICA8c3BhbiBjbGFzcz0iY29udHJvbC1sYWJlbCI+VHJhbnNsYXRpb248L3NwYW4+CiAgICAgICAgICAgICAgPHAgY2xhc3M9Imxhbmd1YWdlLXBhaXIiIGlkPSJsYW5ndWFnZVBhaXIiPldhaXRpbmcgZm9yIHRleHQ8L3A+CiAgICAgICAgICAgIDwvZGl2PgogICAgICAgICAgICA8YnV0dG9uIHR5cGU9ImJ1dHRvbiIgY2xhc3M9Imdob3N0LWJ1dHRvbiBzbWFsbCIgaWQ9ImNvcHlUcmFuc2xhdGlvbkJ1dHRvbiI+Q29weTwvYnV0dG9uPgogICAgICAgICAgPC9kaXY+CiAgICAgICAgICA8cCBjbGFzcz0idHJhbnNsYXRpb24tdGV4dCIgaWQ9InRyYW5zbGF0aW9uVGV4dCI+WW91ciB0cmFuc2xhdGlvbiB3aWxsIGFwcGVhciBoZXJlLjwvcD4KCiAgICAgICAgICA8ZGl2IGNsYXNzPSJyZXN1bHQtYmxvY2siPgogICAgICAgICAgICA8ZGl2IGNsYXNzPSJyZXN1bHQtaGVhZCBjb21wYWN0Ij4KICAgICAgICAgICAgICA8aDI+SGFueXUgUGlueWluPC9oMj4KICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9ImJ1dHRvbiIgY2xhc3M9Imdob3N0LWJ1dHRvbiBzbWFsbCIgaWQ9ImNvcHlQaW55aW5CdXR0b24iPkNvcHk8L2J1dHRvbj4KICAgICAgICAgICAgPC9kaXY+CiAgICAgICAgICAgIDxwIGlkPSJwaW55aW5UZXh0IiBjbGFzcz0icGlueWluLXRleHQiPlBpbnlpbiBhcHBlYXJzIHdoZW4gQ2hpbmVzZSB0ZXh0IGlzIGludm9sdmVkLjwvcD4KICAgICAgICAgIDwvZGl2PgoKICAgICAgICAgIDxkaXYgY2xhc3M9InJlc3VsdC1ibG9jayI+CiAgICAgICAgICAgIDxoMj5NZWFuaW5nPC9oMj4KICAgICAgICAgICAgPHAgaWQ9Im1lYW5pbmdUZXh0Ij5QbGFpbiBtZWFuaW5nIGFwcGVhcnMgaGVyZS48L3A+CiAgICAgICAgICA8L2Rpdj4KCiAgICAgICAgICA8ZGl2IGNsYXNzPSJyZXN1bHQtYmxvY2siPgogICAgICAgICAgICA8aDI+QnVzaW5lc3MgVGVybXM8L2gyPgogICAgICAgICAgICA8dWwgaWQ9InRlcm1zTGlzdCIgY2xhc3M9InRlcm1zLWxpc3QiPgogICAgICAgICAgICAgIDxsaSBjbGFzcz0iZW1wdHktc3RhdGUiPktleSB0ZXJtcyBhbmQgd29yZCBtZWFuaW5ncyBhcHBlYXIgaGVyZS48L2xpPgogICAgICAgICAgICA8L3VsPgogICAgICAgICAgPC9kaXY+CgogICAgICAgICAgPGRpdiBjbGFzcz0icmVzdWx0LWJsb2NrIj4KICAgICAgICAgICAgPGgyPkFsdGVybmF0aXZlczwvaDI+CiAgICAgICAgICAgIDx1bCBpZD0iYWx0ZXJuYXRpdmVzTGlzdCIgY2xhc3M9ImFsdGVybmF0aXZlcy1saXN0Ij4KICAgICAgICAgICAgICA8bGkgY2xhc3M9ImVtcHR5LXN0YXRlIj5BbHRlcm5hdGUgcGhyYXNpbmcgYXBwZWFycyBoZXJlLjwvbGk+CiAgICAgICAgICAgIDwvdWw+CiAgICAgICAgICA8L2Rpdj4KICAgICAgICA8L3NlY3Rpb24+CiAgICAgIDwvc2VjdGlvbj4KCiAgICAgIDxzZWN0aW9uIGNsYXNzPSJoaXN0b3J5LXBhbmVsIiBhcmlhLWxhYmVsPSJSZWNlbnQgdHJhbnNsYXRpb25zIj4KICAgICAgICA8ZGl2IGNsYXNzPSJoaXN0b3J5LWhlYWQiPgogICAgICAgICAgPGgyPlJlY2VudDwvaDI+CiAgICAgICAgICA8YnV0dG9uIHR5cGU9ImJ1dHRvbiIgY2xhc3M9Imdob3N0LWJ1dHRvbiBzbWFsbCIgaWQ9ImNsZWFySGlzdG9yeUJ1dHRvbiI+Q2xlYXI8L2J1dHRvbj4KICAgICAgICA8L2Rpdj4KICAgICAgICA8ZGl2IGlkPSJoaXN0b3J5TGlzdCIgY2xhc3M9Imhpc3RvcnktbGlzdCI+PC9kaXY+CiAgICAgIDwvc2VjdGlvbj4KICAgIDwvbWFpbj4KCiAgICA8c2NyaXB0IHNyYz0iL2FwcC5qcyIgZGVmZXI+PC9zY3JpcHQ+CiAgPC9ib2R5Pgo8L2h0bWw+Cg==";
const B64_APP_JS = "Y29uc3QgTUFYX1RFWFRfTEVOR1RIID0gNTAwMDsKY29uc3QgSElTVE9SWV9LRVkgPSAiZXQtYnVzaW5lc3MtdHJhbnNsYXRvci1oaXN0b3J5LXYxIjsKCmNvbnN0IHN0YXRlID0gewogIGRpcmVjdGlvbjogImVuLXpoIiwKICB0b25lOiAiYnVzaW5lc3MiLAogIGN1cnJlbnRSZXN1bHQ6IG51bGwsCiAgaGlzdG9yeTogbG9hZEhpc3RvcnkoKQp9OwoKY29uc3QgZWxlbWVudHMgPSB7CiAgZm9ybTogZG9jdW1lbnQucXVlcnlTZWxlY3RvcigiI3RyYW5zbGF0b3JGb3JtIiksCiAgc291cmNlVGV4dDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcigiI3NvdXJjZVRleHQiKSwKICBjb250ZXh0VGV4dDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcigiI2NvbnRleHRUZXh0IiksCiAgY2hhckNvdW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCIjY2hhckNvdW50IiksCiAgZGlyZWN0aW9uQ29udHJvbDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcigiI2RpcmVjdGlvbkNvbnRyb2wiKSwKICB0b25lQ29udHJvbDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcigiI3RvbmVDb250cm9sIiksCiAgdHJhbnNsYXRlQnV0dG9uOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCIjdHJhbnNsYXRlQnV0dG9uIiksCiAgcGFzdGVCdXR0b246IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIiNwYXN0ZUJ1dHRvbiIpLAogIGNsZWFyQnV0dG9uOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCIjY2xlYXJCdXR0b24iKSwKICBlcnJvclRleHQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIiNlcnJvclRleHQiKSwKICBjb25uZWN0aW9uU3RhdHVzOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCIjY29ubmVjdGlvblN0YXR1cyIpLAogIGxhbmd1YWdlUGFpcjogZG9jdW1lbnQucXVlcnlTZWxlY3RvcigiI2xhbmd1YWdlUGFpciIpLAogIHRyYW5zbGF0aW9uVGV4dDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcigiI3RyYW5zbGF0aW9uVGV4dCIpLAogIHBpbnlpblRleHQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIiNwaW55aW5UZXh0IiksCiAgbWVhbmluZ1RleHQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIiNtZWFuaW5nVGV4dCIpLAogIHRlcm1zTGlzdDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcigiI3Rlcm1zTGlzdCIpLAogIGFsdGVybmF0aXZlc0xpc3Q6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIiNhbHRlcm5hdGl2ZXNMaXN0IiksCiAgY29weVRyYW5zbGF0aW9uQnV0dG9uOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCIjY29weVRyYW5zbGF0aW9uQnV0dG9uIiksCiAgY29weVBpbnlpbkJ1dHRvbjogZG9jdW1lbnQucXVlcnlTZWxlY3RvcigiI2NvcHlQaW55aW5CdXR0b24iKSwKICBjbGVhckhpc3RvcnlCdXR0b246IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIiNjbGVhckhpc3RvcnlCdXR0b24iKSwKICBoaXN0b3J5TGlzdDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcigiI2hpc3RvcnlMaXN0IikKfTsKCmVsZW1lbnRzLmZvcm0uYWRkRXZlbnRMaXN0ZW5lcigic3VibWl0IiwgYXN5bmMgKGV2ZW50KSA9PiB7CiAgZXZlbnQucHJldmVudERlZmF1bHQoKTsKICBhd2FpdCB0cmFuc2xhdGUoKTsKfSk7CgplbGVtZW50cy5zb3VyY2VUZXh0LmFkZEV2ZW50TGlzdGVuZXIoImlucHV0IiwgdXBkYXRlQ2hhckNvdW50KTsKZWxlbWVudHMuZGlyZWN0aW9uQ29udHJvbC5hZGRFdmVudExpc3RlbmVyKCJjbGljayIsIChldmVudCkgPT4gc2VsZWN0U2VnbWVudChldmVudCwgImRpcmVjdGlvbiIsICJkaXJlY3Rpb24iKSk7CmVsZW1lbnRzLnRvbmVDb250cm9sLmFkZEV2ZW50TGlzdGVuZXIoImNsaWNrIiwgKGV2ZW50KSA9PiBzZWxlY3RTZWdtZW50KGV2ZW50LCAidG9uZSIsICJ0b25lIikpOwplbGVtZW50cy5wYXN0ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCJjbGljayIsIHBhc3RlRnJvbUNsaXBib2FyZCk7CmVsZW1lbnRzLmNsZWFyQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoImNsaWNrIiwgY2xlYXJJbnB1dCk7CmVsZW1lbnRzLmNvcHlUcmFuc2xhdGlvbkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCJjbGljayIsIGNvcHlUcmFuc2xhdGlvbik7CmVsZW1lbnRzLmNvcHlQaW55aW5CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcigiY2xpY2siLCAoKSA9PiBjb3B5VGV4dChlbGVtZW50cy5waW55aW5UZXh0LnRleHRDb250ZW50KSk7CmVsZW1lbnRzLmNsZWFySGlzdG9yeUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCJjbGljayIsIGNsZWFySGlzdG9yeSk7Cgp1cGRhdGVDaGFyQ291bnQoKTsKcmVuZGVySGlzdG9yeSgpOwoKYXN5bmMgZnVuY3Rpb24gdHJhbnNsYXRlKCkgewogIGNvbnN0IHRleHQgPSBlbGVtZW50cy5zb3VyY2VUZXh0LnZhbHVlLnRyaW0oKTsKICBjb25zdCBjb250ZXh0ID0gZWxlbWVudHMuY29udGV4dFRleHQudmFsdWUudHJpbSgpOwoKICBjbGVhckVycm9yKCk7CgogIGlmICghdGV4dCkgewogICAgc2hvd0Vycm9yKCJFbnRlciBzb21ldGhpbmcgdG8gdHJhbnNsYXRlLiIpOwogICAgZWxlbWVudHMuc291cmNlVGV4dC5mb2N1cygpOwogICAgcmV0dXJuOwogIH0KCiAgaWYgKHRleHQubGVuZ3RoID4gTUFYX1RFWFRfTEVOR1RIKSB7CiAgICBzaG93RXJyb3IoIktlZXAgaXQgdW5kZXIgNTAwMCBjaGFyYWN0ZXJzLiIpOwogICAgcmV0dXJuOwogIH0KCiAgc2V0QnVzeSh0cnVlKTsKCiAgdHJ5IHsKICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goIi9hcGkvdHJhbnNsYXRlIiwgewogICAgICBtZXRob2Q6ICJQT1NUIiwKICAgICAgaGVhZGVyczogewogICAgICAgICJjb250ZW50LXR5cGUiOiAiYXBwbGljYXRpb24vanNvbiIKICAgICAgfSwKICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoewogICAgICAgIHRleHQsCiAgICAgICAgY29udGV4dCwKICAgICAgICBkaXJlY3Rpb246IHN0YXRlLmRpcmVjdGlvbiwKICAgICAgICB0b25lOiBzdGF0ZS50b25lCiAgICAgIH0pCiAgICB9KTsKICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZWFkSnNvblJlc3BvbnNlKHJlc3BvbnNlKTsKCiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7CiAgICAgIHRocm93IG5ldyBFcnJvcihkYXRhLmVycm9yIHx8ICJUcmFuc2xhdGlvbiBmYWlsZWQuIik7CiAgICB9CgogICAgc3RhdGUuY3VycmVudFJlc3VsdCA9IGRhdGE7CiAgICByZW5kZXJSZXN1bHQoZGF0YSk7CiAgICBzYXZlSGlzdG9yeSh7IGlucHV0OiB0ZXh0LCBjb250ZXh0LCBkaXJlY3Rpb246IHN0YXRlLmRpcmVjdGlvbiwgdG9uZTogc3RhdGUudG9uZSwgcmVzdWx0OiBkYXRhIH0pOwogIH0gY2F0Y2ggKGVycm9yKSB7CiAgICBzaG93RXJyb3IoZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiAiVHJhbnNsYXRpb24gZmFpbGVkLiIpOwogIH0gZmluYWxseSB7CiAgICBzZXRCdXN5KGZhbHNlKTsKICB9Cn0KCmFzeW5jIGZ1bmN0aW9uIHJlYWRKc29uUmVzcG9uc2UocmVzcG9uc2UpIHsKICBjb25zdCB0ZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpOwoKICBpZiAoIXRleHQudHJpbSgpKSB7CiAgICB0aHJvdyBuZXcgRXJyb3IoYEFQSSByZXR1cm5lZCBhbiBlbXB0eSByZXNwb25zZS4gU3RhdHVzOiAke3Jlc3BvbnNlLnN0YXR1c30uIFRyeSBvcGVuaW5nIC9hcGkvdHJhbnNsYXRlIG9uIHlvdXIgbGl2ZSBzaXRlIHRvIGNoZWNrIHdoZXRoZXIgdGhlIFdvcmtlciBpcyBhY3RpdmUuYCk7CiAgfQoKICB0cnkgewogICAgcmV0dXJuIEpTT04ucGFyc2UodGV4dCk7CiAgfSBjYXRjaCB7CiAgICB0aHJvdyBuZXcgRXJyb3IoYEFQSSBkaWQgbm90IHJldHVybiBKU09OLiBTdGF0dXM6ICR7cmVzcG9uc2Uuc3RhdHVzfS4gRmlyc3QgcGFydCBvZiByZXNwb25zZTogJHt0ZXh0LnNsaWNlKDAsIDE4MCl9YCk7CiAgfQp9CgpmdW5jdGlvbiByZW5kZXJSZXN1bHQocmVzdWx0KSB7CiAgZWxlbWVudHMubGFuZ3VhZ2VQYWlyLnRleHRDb250ZW50ID0gYCR7cmVzdWx0LnNvdXJjZUxhbmd1YWdlIHx8ICJTb3VyY2UifSDihpIgJHtyZXN1bHQudGFyZ2V0TGFuZ3VhZ2UgfHwgIlRhcmdldCJ9YDsKICBlbGVtZW50cy50cmFuc2xhdGlvblRleHQudGV4dENvbnRlbnQgPSByZXN1bHQudHJhbnNsYXRpb24gfHwgIk5vIHRyYW5zbGF0aW9uIHJldHVybmVkLiI7CiAgZWxlbWVudHMucGlueWluVGV4dC50ZXh0Q29udGVudCA9IHJlc3VsdC5waW55aW4gfHwgIk5vIHBpbnlpbiByZXR1cm5lZC4iOwogIGVsZW1lbnRzLm1lYW5pbmdUZXh0LnRleHRDb250ZW50ID0gcmVzdWx0Lm1lYW5pbmcgfHwgIk5vIG1lYW5pbmcgcmV0dXJuZWQuIjsKICByZW5kZXJUZXJtcyhyZXN1bHQudGVybXMgfHwgW10pOwogIHJlbmRlckFsdGVybmF0aXZlcyhyZXN1bHQuYWx0ZXJuYXRpdmVzIHx8IFtdKTsKfQoKZnVuY3Rpb24gcmVuZGVyVGVybXModGVybXMpIHsKICBlbGVtZW50cy50ZXJtc0xpc3QucmVwbGFjZUNoaWxkcmVuKCk7CgogIGlmICghdGVybXMubGVuZ3RoKSB7CiAgICBlbGVtZW50cy50ZXJtc0xpc3QuYXBwZW5kKGVtcHR5SXRlbSgiTm8ga2V5IHRlcm1zIHJldHVybmVkLiIpKTsKICAgIHJldHVybjsKICB9CgogIGZvciAoY29uc3QgdGVybSBvZiB0ZXJtcykgewogICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoImxpIik7CiAgICBpdGVtLmNsYXNzTmFtZSA9ICJ0ZXJtLWl0ZW0iOwoKICAgIGNvbnN0IGhlYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCJkaXYiKTsKICAgIGhlYWQuY2xhc3NOYW1lID0gInRlcm0taGVhZCI7CgogICAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCJzdHJvbmciKTsKICAgIHRpdGxlLnRleHRDb250ZW50ID0gW3Rlcm0uc291cmNlLCB0ZXJtLnRyYW5zbGF0aW9uXS5maWx0ZXIoQm9vbGVhbikuam9pbigiIOKGkiAiKTsKCiAgICBjb25zdCBwaW55aW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCJzcGFuIik7CiAgICBwaW55aW4udGV4dENvbnRlbnQgPSB0ZXJtLnBpbnlpbiB8fCAiIjsKCiAgICBjb25zdCBtZWFuaW5nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgicCIpOwogICAgbWVhbmluZy50ZXh0Q29udGVudCA9IHRlcm0ubWVhbmluZyB8fCAiIjsKCiAgICBjb25zdCBub3RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgic21hbGwiKTsKICAgIG5vdGUudGV4dENvbnRlbnQgPSB0ZXJtLm5vdGUgfHwgIiI7CgogICAgaGVhZC5hcHBlbmQodGl0bGUsIHBpbnlpbik7CiAgICBpdGVtLmFwcGVuZChoZWFkLCBtZWFuaW5nLCBub3RlKTsKICAgIGVsZW1lbnRzLnRlcm1zTGlzdC5hcHBlbmQoaXRlbSk7CiAgfQp9CgpmdW5jdGlvbiByZW5kZXJBbHRlcm5hdGl2ZXMoYWx0ZXJuYXRpdmVzKSB7CiAgZWxlbWVudHMuYWx0ZXJuYXRpdmVzTGlzdC5yZXBsYWNlQ2hpbGRyZW4oKTsKCiAgaWYgKCFhbHRlcm5hdGl2ZXMubGVuZ3RoKSB7CiAgICBlbGVtZW50cy5hbHRlcm5hdGl2ZXNMaXN0LmFwcGVuZChlbXB0eUl0ZW0oIk5vIGFsdGVybmF0ZSBwaHJhc2luZyByZXR1cm5lZC4iKSk7CiAgICByZXR1cm47CiAgfQoKICBmb3IgKGNvbnN0IGFsdGVybmF0aXZlIG9mIGFsdGVybmF0aXZlcykgewogICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoImxpIik7CiAgICBpdGVtLmNsYXNzTmFtZSA9ICJhbHRlcm5hdGl2ZS1pdGVtIjsKCiAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoInN0cm9uZyIpOwogICAgbGFiZWwudGV4dENvbnRlbnQgPSBhbHRlcm5hdGl2ZS5sYWJlbCB8fCAiQWx0ZXJuYXRpdmUiOwoKICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCJwIik7CiAgICB0ZXh0LnRleHRDb250ZW50ID0gYWx0ZXJuYXRpdmUudGV4dCB8fCAiIjsKCiAgICBjb25zdCBtZXRhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgic21hbGwiKTsKICAgIG1ldGEudGV4dENvbnRlbnQgPSBbYWx0ZXJuYXRpdmUucGlueWluLCBhbHRlcm5hdGl2ZS53aGVuVG9Vc2VdLmZpbHRlcihCb29sZWFuKS5qb2luKCIgwrcgIik7CgogICAgaXRlbS5hcHBlbmQobGFiZWwsIHRleHQsIG1ldGEpOwogICAgZWxlbWVudHMuYWx0ZXJuYXRpdmVzTGlzdC5hcHBlbmQoaXRlbSk7CiAgfQp9CgpmdW5jdGlvbiBlbXB0eUl0ZW0odGV4dCkgewogIGNvbnN0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCJsaSIpOwogIGl0ZW0uY2xhc3NOYW1lID0gImVtcHR5LXN0YXRlIjsKICBpdGVtLnRleHRDb250ZW50ID0gdGV4dDsKICByZXR1cm4gaXRlbTsKfQoKZnVuY3Rpb24gc2VsZWN0U2VnbWVudChldmVudCwgc3RhdGVLZXksIGRhdGFLZXkpIHsKICBjb25zdCBidXR0b24gPSBldmVudC50YXJnZXQuY2xvc2VzdCgiYnV0dG9uIik7CgogIGlmICghYnV0dG9uKSB7CiAgICByZXR1cm47CiAgfQoKICBzdGF0ZVtzdGF0ZUtleV0gPSBidXR0b24uZGF0YXNldFtkYXRhS2V5XTsKCiAgZm9yIChjb25zdCBzZWdtZW50IG9mIGJ1dHRvbi5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIi5zZWdtZW50IikpIHsKICAgIHNlZ21lbnQuY2xhc3NMaXN0LnRvZ2dsZSgiYWN0aXZlIiwgc2VnbWVudCA9PT0gYnV0dG9uKTsKICB9Cn0KCmFzeW5jIGZ1bmN0aW9uIHBhc3RlRnJvbUNsaXBib2FyZCgpIHsKICBjbGVhckVycm9yKCk7CgogIHRyeSB7CiAgICBjb25zdCB0ZXh0ID0gYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC5yZWFkVGV4dCgpOwogICAgZWxlbWVudHMuc291cmNlVGV4dC52YWx1ZSA9IHRleHQ7CiAgICB1cGRhdGVDaGFyQ291bnQoKTsKICAgIGVsZW1lbnRzLnNvdXJjZVRleHQuZm9jdXMoKTsKICB9IGNhdGNoIHsKICAgIHNob3dFcnJvcigiQ2xpcGJvYXJkIHBlcm1pc3Npb24gd2FzIGJsb2NrZWQuIik7CiAgfQp9CgpmdW5jdGlvbiBjbGVhcklucHV0KCkgewogIGVsZW1lbnRzLnNvdXJjZVRleHQudmFsdWUgPSAiIjsKICBlbGVtZW50cy5jb250ZXh0VGV4dC52YWx1ZSA9ICIiOwogIHN0YXRlLmN1cnJlbnRSZXN1bHQgPSBudWxsOwogIGNsZWFyRXJyb3IoKTsKICB1cGRhdGVDaGFyQ291bnQoKTsKICBlbGVtZW50cy5zb3VyY2VUZXh0LmZvY3VzKCk7Cn0KCmFzeW5jIGZ1bmN0aW9uIGNvcHlUcmFuc2xhdGlvbigpIHsKICBpZiAoIXN0YXRlLmN1cnJlbnRSZXN1bHQpIHsKICAgIGF3YWl0IGNvcHlUZXh0KGVsZW1lbnRzLnRyYW5zbGF0aW9uVGV4dC50ZXh0Q29udGVudCk7CiAgICByZXR1cm47CiAgfQoKICBjb25zdCByZXN1bHQgPSBzdGF0ZS5jdXJyZW50UmVzdWx0OwogIGNvbnN0IHRleHQgPSBbCiAgICByZXN1bHQudHJhbnNsYXRpb24sCiAgICByZXN1bHQucGlueWluID8gYFBpbnlpbjogJHtyZXN1bHQucGlueWlufWAgOiAiIiwKICAgIHJlc3VsdC5tZWFuaW5nID8gYE1lYW5pbmc6ICR7cmVzdWx0Lm1lYW5pbmd9YCA6ICIiCiAgXQogICAgLmZpbHRlcihCb29sZWFuKQogICAgLmpvaW4oIlxuXG4iKTsKCiAgYXdhaXQgY29weVRleHQodGV4dCk7Cn0KCmFzeW5jIGZ1bmN0aW9uIGNvcHlUZXh0KHRleHQpIHsKICBjbGVhckVycm9yKCk7CgogIHRyeSB7CiAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dCh0ZXh0LnRyaW0oKSk7CiAgICBzZXRTdGF0dXMoIkNvcGllZCIpOwogICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4gc2V0U3RhdHVzKCJSZWFkeSIpLCAxNDAwKTsKICB9IGNhdGNoIHsKICAgIHNob3dFcnJvcigiQ29weSBmYWlsZWQuIik7CiAgfQp9CgpmdW5jdGlvbiBzYXZlSGlzdG9yeShlbnRyeSkgewogIGNvbnN0IGhpc3RvcnlFbnRyeSA9IHsKICAgIC4uLmVudHJ5LAogICAgaWQ6IGNyZWF0ZUhpc3RvcnlJZCgpLAogICAgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkKICB9OwoKICBzdGF0ZS5oaXN0b3J5ID0gW2hpc3RvcnlFbnRyeSwgLi4uc3RhdGUuaGlzdG9yeV0uc2xpY2UoMCwgMTApOwogIGxvY2FsU3RvcmFnZS5zZXRJdGVtKEhJU1RPUllfS0VZLCBKU09OLnN0cmluZ2lmeShzdGF0ZS5oaXN0b3J5KSk7CiAgcmVuZGVySGlzdG9yeSgpOwp9CgpmdW5jdGlvbiBjcmVhdGVIaXN0b3J5SWQoKSB7CiAgaWYgKGdsb2JhbFRoaXMuY3J5cHRvICYmIHR5cGVvZiBnbG9iYWxUaGlzLmNyeXB0by5yYW5kb21VVUlEID09PSAiZnVuY3Rpb24iKSB7CiAgICByZXR1cm4gZ2xvYmFsVGhpcy5jcnlwdG8ucmFuZG9tVVVJRCgpOwogIH0KCiAgcmV0dXJuIGAke0RhdGUubm93KCl9LSR7TWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoMil9YDsKfQoKZnVuY3Rpb24gbG9hZEhpc3RvcnkoKSB7CiAgdHJ5IHsKICAgIGNvbnN0IHBhcnNlZCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oSElTVE9SWV9LRVkpIHx8ICJbXSIpOwogICAgcmV0dXJuIEFycmF5LmlzQXJyYXkocGFyc2VkKSA/IHBhcnNlZCA6IFtdOwogIH0gY2F0Y2ggewogICAgcmV0dXJuIFtdOwogIH0KfQoKZnVuY3Rpb24gcmVuZGVySGlzdG9yeSgpIHsKICBlbGVtZW50cy5oaXN0b3J5TGlzdC5yZXBsYWNlQ2hpbGRyZW4oKTsKCiAgaWYgKCFzdGF0ZS5oaXN0b3J5Lmxlbmd0aCkgewogICAgY29uc3QgZW1wdHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCJwIik7CiAgICBlbXB0eS5jbGFzc05hbWUgPSAiZW1wdHktaGlzdG9yeSI7CiAgICBlbXB0eS50ZXh0Q29udGVudCA9ICJObyByZWNlbnQgdHJhbnNsYXRpb25zIHlldC4iOwogICAgZWxlbWVudHMuaGlzdG9yeUxpc3QuYXBwZW5kKGVtcHR5KTsKICAgIHJldHVybjsKICB9CgogIGZvciAoY29uc3QgaXRlbSBvZiBzdGF0ZS5oaXN0b3J5KSB7CiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCJidXR0b24iKTsKICAgIGJ1dHRvbi50eXBlID0gImJ1dHRvbiI7CiAgICBidXR0b24uY2xhc3NOYW1lID0gImhpc3RvcnktaXRlbSI7CiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcigiY2xpY2siLCAoKSA9PiByZXN0b3JlSGlzdG9yeUl0ZW0oaXRlbSkpOwoKICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgic3BhbiIpOwogICAgaW5wdXQuY2xhc3NOYW1lID0gImhpc3RvcnktaW5wdXQiOwogICAgaW5wdXQudGV4dENvbnRlbnQgPSBpdGVtLmlucHV0OwoKICAgIGNvbnN0IG91dHB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoInNwYW4iKTsKICAgIG91dHB1dC5jbGFzc05hbWUgPSAiaGlzdG9yeS1vdXRwdXQiOwogICAgb3V0cHV0LnRleHRDb250ZW50ID0gaXRlbS5yZXN1bHQ/LnRyYW5zbGF0aW9uIHx8ICIiOwoKICAgIGJ1dHRvbi5hcHBlbmQoaW5wdXQsIG91dHB1dCk7CiAgICBlbGVtZW50cy5oaXN0b3J5TGlzdC5hcHBlbmQoYnV0dG9uKTsKICB9Cn0KCmZ1bmN0aW9uIHJlc3RvcmVIaXN0b3J5SXRlbShpdGVtKSB7CiAgZWxlbWVudHMuc291cmNlVGV4dC52YWx1ZSA9IGl0ZW0uaW5wdXQgfHwgIiI7CiAgZWxlbWVudHMuY29udGV4dFRleHQudmFsdWUgPSBpdGVtLmNvbnRleHQgfHwgIiI7CiAgc3RhdGUuZGlyZWN0aW9uID0gaXRlbS5kaXJlY3Rpb24gfHwgImVuLXpoIjsKICBzdGF0ZS50b25lID0gaXRlbS50b25lIHx8ICJidXNpbmVzcyI7CiAgc3RhdGUuY3VycmVudFJlc3VsdCA9IGl0ZW0ucmVzdWx0IHx8IG51bGw7CiAgdXBkYXRlU2VsZWN0ZWRTZWdtZW50cygpOwogIHVwZGF0ZUNoYXJDb3VudCgpOwoKICBpZiAoaXRlbS5yZXN1bHQpIHsKICAgIHJlbmRlclJlc3VsdChpdGVtLnJlc3VsdCk7CiAgfQp9CgpmdW5jdGlvbiBjbGVhckhpc3RvcnkoKSB7CiAgc3RhdGUuaGlzdG9yeSA9IFtdOwogIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKEhJU1RPUllfS0VZKTsKICByZW5kZXJIaXN0b3J5KCk7Cn0KCmZ1bmN0aW9uIHVwZGF0ZVNlbGVjdGVkU2VnbWVudHMoKSB7CiAgZm9yIChjb25zdCBidXR0b24gb2YgZWxlbWVudHMuZGlyZWN0aW9uQ29udHJvbC5xdWVyeVNlbGVjdG9yQWxsKCIuc2VnbWVudCIpKSB7CiAgICBidXR0b24uY2xhc3NMaXN0LnRvZ2dsZSgiYWN0aXZlIiwgYnV0dG9uLmRhdGFzZXQuZGlyZWN0aW9uID09PSBzdGF0ZS5kaXJlY3Rpb24pOwogIH0KCiAgZm9yIChjb25zdCBidXR0b24gb2YgZWxlbWVudHMudG9uZUNvbnRyb2wucXVlcnlTZWxlY3RvckFsbCgiLnNlZ21lbnQiKSkgewogICAgYnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoImFjdGl2ZSIsIGJ1dHRvbi5kYXRhc2V0LnRvbmUgPT09IHN0YXRlLnRvbmUpOwogIH0KfQoKZnVuY3Rpb24gdXBkYXRlQ2hhckNvdW50KCkgewogIGVsZW1lbnRzLmNoYXJDb3VudC50ZXh0Q29udGVudCA9IGAke2VsZW1lbnRzLnNvdXJjZVRleHQudmFsdWUubGVuZ3RofSAvICR7TUFYX1RFWFRfTEVOR1RIfWA7Cn0KCmZ1bmN0aW9uIHNldEJ1c3koaXNCdXN5KSB7CiAgZWxlbWVudHMudHJhbnNsYXRlQnV0dG9uLmRpc2FibGVkID0gaXNCdXN5OwogIGVsZW1lbnRzLnRyYW5zbGF0ZUJ1dHRvbi50ZXh0Q29udGVudCA9IGlzQnVzeSA/ICJUcmFuc2xhdGluZyIgOiAiVHJhbnNsYXRlIjsKICBzZXRTdGF0dXMoaXNCdXN5ID8gIlRyYW5zbGF0aW5nIiA6ICJSZWFkeSIpOwp9CgpmdW5jdGlvbiBzZXRTdGF0dXModGV4dCkgewogIGVsZW1lbnRzLmNvbm5lY3Rpb25TdGF0dXMudGV4dENvbnRlbnQgPSB0ZXh0Owp9CgpmdW5jdGlvbiBzaG93RXJyb3IobWVzc2FnZSkgewogIGVsZW1lbnRzLmVycm9yVGV4dC50ZXh0Q29udGVudCA9IG1lc3NhZ2U7CiAgc2V0U3RhdHVzKCJFcnJvciIpOwp9CgpmdW5jdGlvbiBjbGVhckVycm9yKCkgewogIGVsZW1lbnRzLmVycm9yVGV4dC50ZXh0Q29udGVudCA9ICIiOwp9Cgp3aW5kb3cuVHJhbnNsYXRvckFwcCA9IHsKICByZW5kZXJUZXJtcywKICBjb3B5VHJhbnNsYXRpb24KfTsK";
const B64_STYLES_CSS = "OnJvb3QgewogIC0tYmc6ICNmNmY4ZmI7CiAgLS1wYW5lbDogI2ZmZmZmZjsKICAtLWluazogIzE3MjAyYTsKICAtLW11dGVkOiAjNjY3MDg1OwogIC0tbGluZTogI2Q5ZTBlYTsKICAtLXRlYWw6ICMwZjc2NmU7CiAgLS10ZWFsLWRhcms6ICMxMTVlNTk7CiAgLS1yZWQ6ICNiNDIzMTg7CiAgLS1hbWJlcjogI2I0NTMwOTsKICAtLWJsdWU6ICMxZDRlZDg7CiAgLS1zaGFkb3c6IDAgMThweCA0MnB4IHJnYmEoMjMsIDMyLCA0MiwgMC4wOSk7Cn0KCiogewogIGJveC1zaXppbmc6IGJvcmRlci1ib3g7Cn0KCmJvZHkgewogIG1hcmdpbjogMDsKICBtaW4taGVpZ2h0OiAxMDB2aDsKICBiYWNrZ3JvdW5kOiB2YXIoLS1iZyk7CiAgY29sb3I6IHZhcigtLWluayk7CiAgZm9udC1mYW1pbHk6IEludGVyLCB1aS1zYW5zLXNlcmlmLCBzeXN0ZW0tdWksIC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgIlNlZ29lIFVJIiwgc2Fucy1zZXJpZjsKfQoKYnV0dG9uLAp0ZXh0YXJlYSwKaW5wdXQgewogIGZvbnQ6IGluaGVyaXQ7Cn0KCmJ1dHRvbiB7CiAgdG91Y2gtYWN0aW9uOiBtYW5pcHVsYXRpb247Cn0KCi5hcHAtc2hlbGwgewogIHdpZHRoOiBtaW4oMTE4MHB4LCBjYWxjKDEwMCUgLSAzMnB4KSk7CiAgbWFyZ2luOiAwIGF1dG87CiAgcGFkZGluZzogMjRweCAwIDM2cHg7Cn0KCi50b3BiYXIgewogIGRpc3BsYXk6IGZsZXg7CiAgYWxpZ24taXRlbXM6IGNlbnRlcjsKICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47CiAgZ2FwOiAxNnB4OwogIG1hcmdpbi1ib3R0b206IDE4cHg7Cn0KCi5leWVicm93IHsKICBtYXJnaW46IDAgMCA0cHg7CiAgY29sb3I6IHZhcigtLXRlYWwpOwogIGZvbnQtc2l6ZTogMC44MnJlbTsKICBmb250LXdlaWdodDogNzYwOwogIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7Cn0KCmgxLApoMiwKcCB7CiAgbWFyZ2luLXRvcDogMDsKfQoKaDEgewogIG1hcmdpbi1ib3R0b206IDA7CiAgZm9udC1zaXplOiAycmVtOwogIGxpbmUtaGVpZ2h0OiAxLjE7Cn0KCmgyIHsKICBtYXJnaW4tYm90dG9tOiAxMHB4OwogIGZvbnQtc2l6ZTogMXJlbTsKICBsaW5lLWhlaWdodDogMS4yNTsKfQoKLnN0YXR1cy1waWxsIHsKICBtaW4td2lkdGg6IDk2cHg7CiAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGluZSk7CiAgYm9yZGVyLXJhZGl1czogOTk5cHg7CiAgYmFja2dyb3VuZDogdmFyKC0tcGFuZWwpOwogIGNvbG9yOiB2YXIoLS1tdXRlZCk7CiAgcGFkZGluZzogOHB4IDEycHg7CiAgdGV4dC1hbGlnbjogY2VudGVyOwogIGZvbnQtc2l6ZTogMC44OHJlbTsKICBmb250LXdlaWdodDogNzAwOwp9CgoudHJhbnNsYXRvci1ncmlkIHsKICBkaXNwbGF5OiBncmlkOwogIGdyaWQtdGVtcGxhdGUtY29sdW1uczogbWlubWF4KDAsIDAuOTJmcikgbWlubWF4KDAsIDEuMDhmcik7CiAgZ2FwOiAxOHB4OwogIGFsaWduLWl0ZW1zOiBzdGFydDsKfQoKLnBhbmVsLAouaGlzdG9yeS1wYW5lbCB7CiAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGluZSk7CiAgYm9yZGVyLXJhZGl1czogOHB4OwogIGJhY2tncm91bmQ6IHZhcigtLXBhbmVsKTsKICBib3gtc2hhZG93OiB2YXIoLS1zaGFkb3cpOwp9CgouaW5wdXQtcGFuZWwsCi5vdXRwdXQtcGFuZWwgewogIHBhZGRpbmc6IDE4cHg7Cn0KCi5maWVsZC1oZWFkLAoucmVzdWx0LWhlYWQsCi5oaXN0b3J5LWhlYWQsCi50ZXJtLWhlYWQgewogIGRpc3BsYXk6IGZsZXg7CiAgYWxpZ24taXRlbXM6IGNlbnRlcjsKICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47CiAgZ2FwOiAxMnB4Owp9CgouZmllbGQtaGVhZCBsYWJlbCwKLmNvbnRyb2wtbGFiZWwsCi5jb250ZXh0LWxhYmVsIHsKICBjb2xvcjogdmFyKC0tbXV0ZWQpOwogIGZvbnQtc2l6ZTogMC44NHJlbTsKICBmb250LXdlaWdodDogNzYwOwp9CgojY2hhckNvdW50IHsKICBjb2xvcjogdmFyKC0tbXV0ZWQpOwogIGZvbnQtc2l6ZTogMC44cmVtOwp9Cgp0ZXh0YXJlYSwKaW5wdXQgewogIHdpZHRoOiAxMDAlOwogIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWxpbmUpOwogIGJvcmRlci1yYWRpdXM6IDhweDsKICBiYWNrZ3JvdW5kOiAjZmJmY2ZlOwogIGNvbG9yOiB2YXIoLS1pbmspOwogIG91dGxpbmU6IG5vbmU7Cn0KCnRleHRhcmVhIHsKICBtaW4taGVpZ2h0OiAyNjBweDsKICBtYXJnaW4tdG9wOiA4cHg7CiAgcGFkZGluZzogMTRweDsKICBsaW5lLWhlaWdodDogMS41NTsKICByZXNpemU6IHZlcnRpY2FsOwp9CgppbnB1dCB7CiAgaGVpZ2h0OiA0NHB4OwogIG1hcmdpbi10b3A6IDdweDsKICBwYWRkaW5nOiAwIDEycHg7Cn0KCnRleHRhcmVhOmZvY3VzLAppbnB1dDpmb2N1cyB7CiAgYm9yZGVyLWNvbG9yOiB2YXIoLS10ZWFsKTsKICBib3gtc2hhZG93OiAwIDAgMCAzcHggcmdiYSgxNSwgMTE4LCAxMTAsIDAuMTQpOwp9CgouY29udHJvbC1yb3cgewogIGRpc3BsYXk6IGdyaWQ7CiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyOwogIGdhcDogMTRweDsKICBtYXJnaW4tdG9wOiAxNnB4Owp9Cgouc2VnbWVudGVkIHsKICBkaXNwbGF5OiBncmlkOwogIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDMsIG1pbm1heCgwLCAxZnIpKTsKICBnYXA6IDRweDsKICBtaW4taGVpZ2h0OiA0NHB4OwogIG1hcmdpbi10b3A6IDdweDsKICBwYWRkaW5nOiA0cHg7CiAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tbGluZSk7CiAgYm9yZGVyLXJhZGl1czogOHB4OwogIGJhY2tncm91bmQ6ICNmMmY1Zjk7Cn0KCi5zZWdtZW50ZWQudHdvLXdheSB7CiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMiwgbWlubWF4KDAsIDFmcikpOwp9Cgouc2VnbWVudCB7CiAgbWluLXdpZHRoOiAwOwogIGJvcmRlcjogMDsKICBib3JkZXItcmFkaXVzOiA2cHg7CiAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7CiAgY29sb3I6IHZhcigtLW11dGVkKTsKICBwYWRkaW5nOiA4cHggNnB4OwogIGZvbnQtc2l6ZTogMC45cmVtOwogIGZvbnQtd2VpZ2h0OiA3NjA7CiAgY3Vyc29yOiBwb2ludGVyOwp9Cgouc2VnbWVudC5hY3RpdmUgewogIGJhY2tncm91bmQ6IHZhcigtLXBhbmVsKTsKICBjb2xvcjogdmFyKC0tdGVhbC1kYXJrKTsKICBib3gtc2hhZG93OiAwIDFweCAzcHggcmdiYSgyMywgMzIsIDQyLCAwLjEpOwp9CgouY29udGV4dC1sYWJlbCB7CiAgZGlzcGxheTogYmxvY2s7CiAgbWFyZ2luLXRvcDogMTZweDsKfQoKLmFjdGlvbi1yb3cgewogIGRpc3BsYXk6IGZsZXg7CiAgZmxleC13cmFwOiB3cmFwOwogIGdhcDogMTBweDsKICBtYXJnaW4tdG9wOiAxNnB4Owp9CgoucHJpbWFyeS1idXR0b24sCi5naG9zdC1idXR0b24gewogIG1pbi1oZWlnaHQ6IDQycHg7CiAgYm9yZGVyLXJhZGl1czogOHB4OwogIHBhZGRpbmc6IDAgMTVweDsKICBmb250LXdlaWdodDogODAwOwogIGN1cnNvcjogcG9pbnRlcjsKfQoKLnByaW1hcnktYnV0dG9uIHsKICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS10ZWFsKTsKICBiYWNrZ3JvdW5kOiB2YXIoLS10ZWFsKTsKICBjb2xvcjogI2ZmZmZmZjsKfQoKLnByaW1hcnktYnV0dG9uOmhvdmVyIHsKICBiYWNrZ3JvdW5kOiB2YXIoLS10ZWFsLWRhcmspOwp9CgoucHJpbWFyeS1idXR0b246ZGlzYWJsZWQgewogIGN1cnNvcjogd2FpdDsKICBvcGFjaXR5OiAwLjY4Owp9CgouZ2hvc3QtYnV0dG9uIHsKICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1saW5lKTsKICBiYWNrZ3JvdW5kOiAjZmZmZmZmOwogIGNvbG9yOiB2YXIoLS1pbmspOwp9CgouZ2hvc3QtYnV0dG9uOmhvdmVyIHsKICBib3JkZXItY29sb3I6ICNiOGMyY2Y7Cn0KCi5naG9zdC1idXR0b24uc21hbGwgewogIG1pbi1oZWlnaHQ6IDM0cHg7CiAgcGFkZGluZzogMCAxMXB4OwogIGZvbnQtc2l6ZTogMC44NHJlbTsKfQoKLmVycm9yLXRleHQgewogIG1pbi1oZWlnaHQ6IDIycHg7CiAgbWFyZ2luOiAxMnB4IDAgMDsKICBjb2xvcjogdmFyKC0tcmVkKTsKICBmb250LXNpemU6IDAuOTJyZW07CiAgZm9udC13ZWlnaHQ6IDcwMDsKfQoKLmxhbmd1YWdlLXBhaXIgewogIG1hcmdpbjogNHB4IDAgMDsKICBjb2xvcjogdmFyKC0tbXV0ZWQpOwogIGZvbnQtc2l6ZTogMC45cmVtOwp9CgoudHJhbnNsYXRpb24tdGV4dCB7CiAgbWluLWhlaWdodDogOTRweDsKICBtYXJnaW46IDE0cHggMCAwOwogIHBhZGRpbmctYm90dG9tOiAxNHB4OwogIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCB2YXIoLS1saW5lKTsKICBmb250LXNpemU6IDEuNDVyZW07CiAgbGluZS1oZWlnaHQ6IDEuNTU7CiAgd2hpdGUtc3BhY2U6IHByZS13cmFwOwp9CgoucmVzdWx0LWJsb2NrIHsKICBwYWRkaW5nLXRvcDogMTZweDsKfQoKLnJlc3VsdC1oZWFkLmNvbXBhY3QgaDIgewogIG1hcmdpbi1ib3R0b206IDA7Cn0KCi5waW55aW4tdGV4dCB7CiAgY29sb3I6IHZhcigtLWJsdWUpOwogIGZvbnQtc2l6ZTogMS4wNHJlbTsKICBsaW5lLWhlaWdodDogMS42OwogIHdoaXRlLXNwYWNlOiBwcmUtd3JhcDsKfQoKI21lYW5pbmdUZXh0IHsKICBjb2xvcjogIzM0NDA1NDsKICBsaW5lLWhlaWdodDogMS42Owp9CgoudGVybXMtbGlzdCwKLmFsdGVybmF0aXZlcy1saXN0IHsKICBkaXNwbGF5OiBncmlkOwogIGdhcDogMTBweDsKICBtYXJnaW46IDA7CiAgcGFkZGluZzogMDsKICBsaXN0LXN0eWxlOiBub25lOwp9CgoudGVybS1pdGVtLAouYWx0ZXJuYXRpdmUtaXRlbSwKLmVtcHR5LXN0YXRlIHsKICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1saW5lKTsKICBib3JkZXItcmFkaXVzOiA4cHg7CiAgcGFkZGluZzogMTJweDsKICBiYWNrZ3JvdW5kOiAjZmJmY2ZlOwp9CgoudGVybS1oZWFkIHN0cm9uZyB7CiAgbGluZS1oZWlnaHQ6IDEuMzU7Cn0KCi50ZXJtLWhlYWQgc3BhbiB7CiAgY29sb3I6IHZhcigtLWFtYmVyKTsKICBmb250LXdlaWdodDogODAwOwp9CgoudGVybS1pdGVtIHAsCi5hbHRlcm5hdGl2ZS1pdGVtIHAgewogIG1hcmdpbjogOHB4IDAgNHB4OwogIGNvbG9yOiAjMzQ0MDU0OwogIGxpbmUtaGVpZ2h0OiAxLjU1Owp9CgoudGVybS1pdGVtIHNtYWxsLAouYWx0ZXJuYXRpdmUtaXRlbSBzbWFsbCB7CiAgY29sb3I6IHZhcigtLW11dGVkKTsKfQoKLmVtcHR5LXN0YXRlLAouZW1wdHktaGlzdG9yeSB7CiAgY29sb3I6IHZhcigtLW11dGVkKTsKfQoKLmhpc3RvcnktcGFuZWwgewogIG1hcmdpbi10b3A6IDE4cHg7CiAgcGFkZGluZzogMTZweDsKfQoKLmhpc3RvcnktaGVhZCBoMiB7CiAgbWFyZ2luOiAwOwp9CgouaGlzdG9yeS1saXN0IHsKICBkaXNwbGF5OiBncmlkOwogIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDIsIG1pbm1heCgwLCAxZnIpKTsKICBnYXA6IDEwcHg7CiAgbWFyZ2luLXRvcDogMTJweDsKfQoKLmhpc3RvcnktaXRlbSB7CiAgZGlzcGxheTogZ3JpZDsKICBnYXA6IDVweDsKICB3aWR0aDogMTAwJTsKICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1saW5lKTsKICBib3JkZXItcmFkaXVzOiA4cHg7CiAgYmFja2dyb3VuZDogI2ZmZmZmZjsKICBwYWRkaW5nOiAxMnB4OwogIGNvbG9yOiB2YXIoLS1pbmspOwogIHRleHQtYWxpZ246IGxlZnQ7CiAgY3Vyc29yOiBwb2ludGVyOwp9CgouaGlzdG9yeS1pbnB1dCwKLmhpc3Rvcnktb3V0cHV0IHsKICBvdmVyZmxvdzogaGlkZGVuOwogIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzOwogIHdoaXRlLXNwYWNlOiBub3dyYXA7Cn0KCi5oaXN0b3J5LWlucHV0IHsKICBmb250LXdlaWdodDogODAwOwp9CgouaGlzdG9yeS1vdXRwdXQgewogIGNvbG9yOiB2YXIoLS1tdXRlZCk7CiAgZm9udC1zaXplOiAwLjlyZW07Cn0KCkBtZWRpYSAobWF4LXdpZHRoOiA3MjBweCkgewogIC5hcHAtc2hlbGwgewogICAgd2lkdGg6IG1pbigxMDAlIC0gMjBweCwgNjIwcHgpOwogICAgcGFkZGluZzogMTRweCAwIDI0cHg7CiAgfQoKICAudG9wYmFyIHsKICAgIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0OwogIH0KCiAgaDEgewogICAgZm9udC1zaXplOiAxLjU1cmVtOwogIH0KCiAgLnN0YXR1cy1waWxsIHsKICAgIG1pbi13aWR0aDogODBweDsKICAgIHBhZGRpbmc6IDdweCAxMHB4OwogIH0KCiAgLnRyYW5zbGF0b3ItZ3JpZCwKICAuY29udHJvbC1yb3csCiAgLmhpc3RvcnktbGlzdCB7CiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjsKICB9CgogIC5pbnB1dC1wYW5lbCwKICAub3V0cHV0LXBhbmVsLAogIC5oaXN0b3J5LXBhbmVsIHsKICAgIHBhZGRpbmc6IDE0cHg7CiAgfQoKICB0ZXh0YXJlYSB7CiAgICBtaW4taGVpZ2h0OiAyMTBweDsKICB9CgogIC5hY3Rpb24tcm93IHsKICAgIGRpc3BsYXk6IGdyaWQ7CiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnI7CiAgfQoKICAucHJpbWFyeS1idXR0b24gewogICAgZ3JpZC1jb2x1bW46IDEgLyAtMTsKICB9CgogIC50cmFuc2xhdGlvbi10ZXh0IHsKICAgIGZvbnQtc2l6ZTogMS4yNXJlbTsKICB9Cn0K";

const INDEX_HTML = decodeBase64(B64_INDEX_HTML);
const APP_JS = decodeBase64(B64_APP_JS);
const STYLES_CSS = decodeBase64(B64_STYLES_CSS);

const DEEPSEEK_CHAT_URL = "https://api.deepseek.com/chat/completions";

const BUSINESS_TERMS = [
  ["alignment", "对齐", "duìqí", "Make sure people agree on the same goal or decision."],
  ["scope", "范围", "fànwéi", "The agreed boundary of what work is included."],
  ["deliverable", "交付物", "jiāofùwù", "A concrete output that must be delivered."],
  ["roadmap", "路线图", "lùxiàntú", "The planned sequence of product or project work."],
  ["priority", "优先级", "yōuxiānjí", "Relative importance or order of work."],
  ["stakeholder", "相关方", "xiāngguān fāng", "People or teams affected by a decision or project."],
  ["requirement", "需求", "xūqiú", "What the product, system, or business needs."],
  ["blocker", "阻塞点", "zǔsè diǎn", "Something preventing progress."],
  ["trade-off", "取舍", "qǔshě", "A decision where gaining one thing means giving up another."],
  ["rollout", "上线/灰度发布", "shàngxiàn / huīdù fābù", "Launch broadly, or launch gradually to a limited group first."],
  ["follow up", "跟进", "gēnjìn", "Continue checking or driving the next action."],
  ["deadline", "截止时间", "jiézhǐ shíjiān", "The final due time."],
  ["risk", "风险", "fēngxiǎn", "Something that could cause failure, delay, or loss."],
  ["decision", "决策", "juécè", "A formal choice or conclusion."],
  ["dependency", "依赖项", "yīlài xiàng", "Work or approval needed before another task can proceed."]
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/translate") {
      return handleTranslate(request, env);
    }

    if (url.pathname === "/" || url.pathname === "/index.html") {
      return assetResponse(INDEX_HTML, "text/html; charset=utf-8");
    }

    if (url.pathname === "/app.js") {
      return assetResponse(APP_JS, "text/javascript; charset=utf-8");
    }

    if (url.pathname === "/styles.css") {
      return assetResponse(STYLES_CSS, "text/css; charset=utf-8");
    }

    return jsonResponse({ error: "Not found." }, 404);
  }
};

async function handleTranslate(request, env) {
  if (request.method === "OPTIONS") {
    return jsonResponse({ ok: true });
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Use POST for translation." }, 405);
  }

  try {
    const payload = await request.json();
    const translationRequest = validateTranslateRequest(payload);

    if (!env.DEEPSEEK_API_KEY && !env.OPENAI_API_KEY) {
      return jsonResponse(
        { error: "Missing DEEPSEEK_API_KEY. Add it in Cloudflare Worker Variables and Secrets." },
        500
      );
    }

    if (env.DEEPSEEK_API_KEY) {
      const upstream = await fetch(DEEPSEEK_CHAT_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${env.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify(buildDeepSeekRequest(translationRequest, env.DEEPSEEK_MODEL || "deepseek-v4-flash"))
      });
      const upstreamPayload = await readUpstreamPayload(upstream);

      if (!upstream.ok) {
        const message = upstreamPayload?.error?.message || upstreamPayload?.message || `HTTP ${upstream.status}`;
        return jsonResponse({ error: `DeepSeek error: ${message}` }, 502);
      }

      return jsonResponse(parseDeepSeekResponse(upstreamPayload));
    }

    const upstream = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(buildOpenAIRequest(translationRequest, env.OPENAI_MODEL || "gpt-5.4-mini"))
    });
    const upstreamPayload = await readUpstreamPayload(upstream);

    if (!upstream.ok) {
      const message = upstreamPayload?.error?.message || upstreamPayload?.message || `HTTP ${upstream.status}`;
      return jsonResponse({ error: `Translation service error: ${message}` }, 502);
    }

    return jsonResponse(parseOpenAIResponse(upstreamPayload));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong.";
    const status = isUserFixableError(message) ? 400 : 500;
    return jsonResponse({ error: message }, status);
  }
}

function buildDeepSeekRequest(request, model) {
  return {
    model,
    messages: [
      {
        role: "system",
        content: `${buildSystemPrompt()}

Return only valid JSON. Use exactly this JSON shape:
{
  "sourceLanguage": "English",
  "targetLanguage": "Chinese",
  "translation": "translated text",
  "pinyin": "Hanyu Pinyin with tone marks",
  "meaning": "plain English explanation",
  "terms": [
    {
      "source": "business term",
      "translation": "translated term",
      "pinyin": "term pinyin if Chinese is involved",
      "meaning": "simple English meaning",
      "note": "brief usage note"
    }
  ],
  "alternatives": [
    {
      "label": "Shorter",
      "text": "alternate wording",
      "pinyin": "pinyin if Chinese is involved",
      "whenToUse": "when to use this wording"
    }
  ],
  "usageNotes": ["brief note"],
  "confidence": "high"
}`
      },
      {
        role: "user",
        content: JSON.stringify(request)
      }
    ],
    response_format: { type: "json_object" },
    max_tokens: 1800,
    stream: false
  };
}

function assetResponse(body, contentType) {
  return new Response(body, {
    headers: {
      "content-type": contentType,
      "cache-control": "public, max-age=300"
    }
  });
}

function decodeBase64(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new TextDecoder().decode(bytes);
}

function validateTranslateRequest(input = {}) {
  const text = typeof input.text === "string" ? input.text.trim() : "";
  const direction = typeof input.direction === "string" ? input.direction : "auto";
  const tone = typeof input.tone === "string" ? input.tone : "business";
  const context = typeof input.context === "string" ? input.context.trim().slice(0, 1000) : "";

  if (!text) throw new Error("Enter something to translate.");
  if (text.length > MAX_TEXT_LENGTH) throw new Error("Keep it under 5000 characters.");
  if (!["auto", "en-zh", "zh-en"].includes(direction)) throw new Error("Choose a valid translation direction.");
  if (!["business", "plain", "polished"].includes(tone)) throw new Error("Choose a valid tone.");

  return { text, direction, tone, context };
}

function buildOpenAIRequest(request, model) {
  return {
    model,
    input: [
      {
        role: "developer",
        content: [{ type: "input_text", text: buildSystemPrompt() }]
      },
      {
        role: "user",
        content: [{ type: "input_text", text: JSON.stringify(request) }]
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "business_translation_result",
        strict: true,
        schema: translationSchema()
      }
    },
    reasoning: { effort: "low" },
    max_output_tokens: 1800
  };
}

function buildSystemPrompt() {
  const glossary = BUSINESS_TERMS.map(
    ([english, chinese, pinyin, meaning]) => `- ${english}: ${chinese} (${pinyin}) means ${meaning}`
  ).join("\n");

  return `You are a fast English-Chinese business translator for a product manager working in a Mainland Chinese company.

Translate between English and Simplified Chinese. Prefer Mainland Chinese business wording over casual, literal, or Taiwan/Hong Kong phrasing.

Rules:
- Detect source language when direction is auto.
- For English to Chinese, produce natural corporate Chinese for meetings, chat, specs, and project updates.
- For Chinese to English, translate the business meaning clearly rather than word-for-word.
- Preserve names, product names, acronyms, numbers, dates, times, links, bullet structure, and code-like tokens.
- Always include Hanyu Pinyin with tone marks for the Chinese translation or Chinese source phrase.
- Always explain the plain meaning of the full sentence or paragraph.
- Always extract important business words or phrases and explain each term in simple English.
- Use Simplified Chinese characters.
- Do not wrap the JSON in markdown.

Tone modes:
- business: professional, concise, WeChat/work-chat friendly.
- plain: direct and easy to understand.
- polished: more formal and executive-ready.

Common business glossary to prefer where appropriate:
${glossary}`;
}

function translationSchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: [
      "sourceLanguage",
      "targetLanguage",
      "translation",
      "pinyin",
      "meaning",
      "terms",
      "alternatives",
      "usageNotes",
      "confidence"
    ],
    properties: {
      sourceLanguage: { type: "string" },
      targetLanguage: { type: "string" },
      translation: { type: "string" },
      pinyin: { type: "string" },
      meaning: { type: "string" },
      terms: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["source", "translation", "pinyin", "meaning", "note"],
          properties: {
            source: { type: "string" },
            translation: { type: "string" },
            pinyin: { type: "string" },
            meaning: { type: "string" },
            note: { type: "string" }
          }
        }
      },
      alternatives: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["label", "text", "pinyin", "whenToUse"],
          properties: {
            label: { type: "string" },
            text: { type: "string" },
            pinyin: { type: "string" },
            whenToUse: { type: "string" }
          }
        }
      },
      usageNotes: { type: "array", items: { type: "string" } },
      confidence: { type: "string", enum: ["high", "medium", "low"] }
    }
  };
}

function parseOpenAIResponse(payload) {
  const outputText = extractOutputText(payload);
  if (!outputText) throw new Error("The translation service returned no text.");

  return normalizeTranslationPayload(parseJsonText(outputText));
}

function parseDeepSeekResponse(payload) {
  const outputText = payload?.choices?.[0]?.message?.content || "";
  if (!outputText) throw new Error("DeepSeek returned no text.");

  return normalizeTranslationPayload(parseJsonText(outputText));
}

function parseJsonText(text) {
  return JSON.parse(text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, ""));
}

function normalizeTranslationPayload(parsed) {
  if (!parsed || typeof parsed !== "object" || typeof parsed.translation !== "string") {
    throw new Error("The translation service returned an unexpected format.");
  }

  return {
    sourceLanguage: stringOrEmpty(parsed.sourceLanguage),
    targetLanguage: stringOrEmpty(parsed.targetLanguage),
    translation: stringOrEmpty(parsed.translation),
    pinyin: stringOrEmpty(parsed.pinyin),
    meaning: stringOrEmpty(parsed.meaning),
    terms: Array.isArray(parsed.terms) ? parsed.terms.map(normalizeTerm) : [],
    alternatives: Array.isArray(parsed.alternatives) ? parsed.alternatives.map(normalizeAlternative) : [],
    usageNotes: Array.isArray(parsed.usageNotes) ? parsed.usageNotes.map(String).filter(Boolean) : [],
    confidence: ["high", "medium", "low"].includes(parsed.confidence) ? parsed.confidence : "medium"
  };
}

function extractOutputText(payload) {
  if (payload && typeof payload.output_text === "string") return payload.output_text;

  for (const item of payload?.output || []) {
    for (const content of item?.content || []) {
      if (typeof content?.text === "string") return content.text;
    }
  }

  return "";
}

async function readUpstreamPayload(response) {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function normalizeTerm(term) {
  return {
    source: stringOrEmpty(term?.source),
    translation: stringOrEmpty(term?.translation),
    pinyin: stringOrEmpty(term?.pinyin),
    meaning: stringOrEmpty(term?.meaning),
    note: stringOrEmpty(term?.note)
  };
}

function normalizeAlternative(alternative) {
  return {
    label: stringOrEmpty(alternative?.label),
    text: stringOrEmpty(alternative?.text),
    pinyin: stringOrEmpty(alternative?.pinyin),
    whenToUse: stringOrEmpty(alternative?.whenToUse)
  };
}

function isUserFixableError(message) {
  return (
    message.includes("Enter something") ||
    message.includes("Keep it under") ||
    message.includes("valid translation direction") ||
    message.includes("valid tone")
  );
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

function stringOrEmpty(value) {
  return typeof value === "string" ? value : "";
}
