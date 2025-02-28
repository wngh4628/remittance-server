# 모인 백엔드 과제 (NestJS)

## 📌 프로젝트 개요
이 프로젝트는 TypeORM을 활용한 MySQL 데이터베이스 연동, Swagger를 통한 API 문서화, Winston 기반 로깅 시스템, 글로벌 예외 처리, JWT 기반 인증 시스템을 갖추고 있으며, Docker 환경에서 MySQL을 손쉽게 배포할 수 있도록 설계되었습니다.

또한, 트랜잭션 및 로깅 강화를 위해 AsyncLocalStorage 기반의 TraceId 관리 시스템을 적용하여, API 요청의 흐름을 추적하고 예외 발생 시 세부적인 디버깅이 가능하도록 구현되었습니다.

주요 기능:

사용자 회원가입 및 로그인 (JWT 인증)
송금 견적서 생성 (환율 및 수수료 계산 로직 포함)
송금 요청 (견적서 유효성 검증 및 송금 한도 적용)
사용자 거래 내역 조회 (향후 페이징 기능 추가 가능)
Swagger 자동 문서화 적용 (http://localhost:9006/api-docs)
Winston 기반 로깅 및 트레이싱 시스템 적용 (요청별 traceId 생성 및 관리)
전역 예외 처리 (AllExceptionsFilter)를 활용한 일관된 에러 응답


## 🚀 기술 스택
- **프로그래밍 언어**: TypeScript 5.4+
- **프레임워크**: NestJS 10.4.2
- **데이터베이스**: MySQL(Docker 설정)
- **ORM**: TypeORM
- **런타임 환경**: Node.js 22
- **단위 테스트**: @nestjs/testing
- **빌드 및 패키지 매니저**: Yarn

## 📁 프로젝트 구조
```
.
├── src
│   ├── core           # 공통 유틸리티 및 데코레이터
│   ├── domains        # 도메인별 모듈 (User, Transfer 등)
│   ├── main.ts        # 애플리케이션 엔트리 포인트
│   └── app.module.ts  # 최상위 모듈
├── test               # 단위 테스트 코드
├── package.json       # 프로젝트 의존성 및 실행 스크립트
├── README.md          # 프로젝트 설명서
```

## 🔧 실행 방법
### 1️⃣ **로컬 개발 환경 실행**
```sh
yarn install       # 의존성 설치
yarn dev           # Dev 서버 실행 (http://localhost:9006)
yarn start         # Prod 서버 실행
yarn test          # 전체 테스트
```

### 2️⃣ **MySQL Docker 이미지 실행**
```sh
압축 풀기: docker load -i moin_mysql.tar
실행: docker run -d --name moin_mysql -p 3306:3306 moin_mysql
```

### 3️⃣ **테스트 실행**
```sh
yarn test         # 모든 단위 테스트 실행
* 데이터 베이스에 데이터가 없을 시, 몇몇 단위 테스트가 통과 안될 수도 있습니다.
* ex -> 견적서가 만료 테스트
```

### **송금 견적서 계산법**
견적서(Quote) 생성 시, 다음과 같은 계산법이 적용됩니다:

1. **수수료 계산:**  
   - **USD 송금:**  
     - 100만원 이하: `수수료율 0.2% + 고정 수수료 1000원`  
     - 100만원 초과: `수수료율 0.1% + 고정 수수료 3000원`  
   - **JPY 송금:**  
     - `수수료율 0.5% + 고정 수수료 3000원`  

2. **실제 송금액 계산:**  
   - `보내는 금액 - 수수료 = 최종 변환할 금액`  

3. **환율 적용:**  
   - KRW → USD 환율 적용 (예: `1301.01`)  
   - USD → Target Currency 환율 적용  

4. **최종 수취 금액 계산:**  
   - `수취 금액 = (보내는 금액 - 수수료) / KRW→USD 환율 × USD→TargetCurrency 환율`  

5. **견적서 만료 시간:**  
   - `견적 생성 후 +10분 이내 유효`  


## 📝 API 문서 (Swagger 설정)
NestJS의 Swagger 모듈을 활용하여 API 문서를 자동 생성합니다.
Swagger UI를 통해 API를 테스트할 수 있으며, 어플리케이션을 실행 후, `http://localhost:9006/api-docs` 경로에서 확인 가능합니다.

Swagger UI URL:  
```
http://localhost:9006/api-docs
```

### **Swagger 설정**
- **`swaggerConfig`**: Swagger 문서의 기본 설정을 정의합니다.
- **`initSwagger`**: Swagger 문서를 NestJS 애플리케이션에 적용하는 함수입니다.
- **Swagger 커스텀 데코레이터**:
  - `ApiPostDecorator`: POST API 요청을 위한 공통 Swagger 설정을 적용하는 데코레이터
  - `ApiCreatedResponseTemplate`: 생성 성공 응답을 정의하는 템플릿
  - `ApiOkResponseTemplate`: 200 OK 응답을 정의하는 템플릿
  - `ApiCommonErrorResponseTemplate`: 공통 에러 응답을 정의하는 템플릿
  - `ApiUnauthorizedErrorResponse`: 인증이 필요한 API에서 발생할 수 있는 오류 응답을 정의
  - `ApiErrorResponseTemplate`: 특정 에러 코드에 대한 응답을 설정하는 데코레이터

## 🔑 보안 고려 사항
- **JWT UserGard & Passport**: `Bearer Token` 인증은 UserGard와 Passport를 이용하여 구현했습니다.
- **비밀번호 및 민감 정보 암호화**: 
  - 비밀번호는 **bcrypt**를 이용해 해싱 후 저장됩니다.
  - AES-256-CBC 알고리즘을 이용해 민감 정보를 암호화합니다.
- **로깅 및 트레이싱 시스템 추가**: 
  - TraceExecution 데코레이터를 활용하여 각 서비스의 실행 흐름을 로깅하고 예외 발생 시 상세 정보를 기록합니다.
  - TraceTemplate 패턴을 적용하여 서비스 로직 실행을 감싸고 예외 발생 시 일관된 처리를 수행합니다.
  - AsyncLocalStorage를 활용하여 요청별 traceId를 관리하고, 이를 기반으로 실행 단계를 추적할 수 있도록 구현하였습니다.
  - WinstonLoggerService를 활용하여 다양한 로깅 수준을 적용하고, 콘솔 및 파일 로그를 분리하여 저장합니다.
- **글로벌 예외 처리 (`AllExceptionsFilter`)**:
  - 모든 예외를 `AllExceptionsFilter`에서 중앙 관리하며, 예외 발생 시 상세한 로그를 남깁니다.
  - HTTP 예외 및 내부 서버 오류를 구분하여 적절한 응답을 반환합니다.
  - `WinstonLoggerService`를 이용하여 에러 스택을 로깅하고, 클라이언트에게 표준화된 응답 형식을 제공합니다.


## 📌 검증 결과 및 회고
### ✅ 구현한 사항
- **NestJS 기반 백엔드 API 구축**
- **TypeORM을 활용한 MySQL 연동** (Docker 기반 환경 포함)
- **사용자 인증 및 송금 견적서 계산 기능 구현**
- **로깅 및 트레이싱 기능 추가하여 시스템 가시성 강화**
- **Swagger 기반 API 문서화 및 커스텀 데코레이터를 활용한 자동화된 문서화 지원**
- **전역 예외 처리 (`AllExceptionsFilter`) 적용**
- **단위 테스트 작성 및 검증 진행**

### 🔄 개선할 사항
2. **API 응답 통일성**: 예제의 응답 컨벤션이 가끔 통일되지 않았습니다.
3. **페이징 처리 추가**: 거래 내역 조회 API에 페이징 기능 추가 필요. 페이징 가능하도록 페이징 상속 적용

